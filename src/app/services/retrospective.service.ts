import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';
import {
  Card,
  CardsBySection,
  SectionType,
  SortOption,
  ViewFilter,
  emptyCardsBySection,
} from '../models/card.model';

const STORAGE_KEY = 'retro-board-state';
const VALID_SECTION_IDS: readonly SectionType[] = [
  'went-well',
  'improve',
  'start-doing',
  'action-items',
];

@Injectable({ providedIn: 'root' })
export class RetrospectiveService {
  private readonly cardsSubject = new BehaviorSubject<Card[]>(this.loadFromStorage());
  private readonly viewFilterSubject = new BehaviorSubject<ViewFilter>('all');
  private readonly sortOptionSubject = new BehaviorSubject<SortOption>('created-desc');
  private readonly editingCardIdSubject = new BehaviorSubject<string | null>(null);

  readonly cards$: Observable<Card[]> = this.cardsSubject.asObservable();
  readonly viewFilter$: Observable<ViewFilter> = this.viewFilterSubject.asObservable();
  readonly sortOption$: Observable<SortOption> = this.sortOptionSubject.asObservable();
  readonly editingCardId$: Observable<string | null> = this.editingCardIdSubject.asObservable();

  readonly visibleCardsBySection$: Observable<CardsBySection> = combineLatest([
    this.cardsSubject,
    this.viewFilterSubject,
    this.sortOptionSubject,
  ]).pipe(map(([cards, filter, sort]) => this.deriveVisibleCardsBySection(cards, filter, sort)));

  readonly editingCard$: Observable<Card | null> = combineLatest([
    this.cardsSubject,
    this.editingCardIdSubject,
  ]).pipe(
    map(([cards, id]) => (id ? cards.find((card) => card.id === id) ?? null : null)),
  );

  constructor() {
    this.cardsSubject.subscribe((cards) => this.saveToStorage(cards));
  }

  addCard(sectionId: SectionType): string {
    const id = this.generateId();
    const sectionCount = this.cardsSubject.value.filter((c) => c.sectionId === sectionId).length;
    const newCard: Card = {
      id,
      text: '',
      sectionId,
      createdAt: Date.now(),
      votes: 0,
      order: sectionCount,
    };
    this.cardsSubject.next([...this.cardsSubject.value, newCard]);
    return id;
  }

  updateCardText(id: string, text: string): void {
    const trimmed = text.trim();
    if (trimmed.length === 0) {
      this.deleteCard(id);
      this.stopEditing();
      return;
    }
    const next = this.cardsSubject.value.map((card) =>
      card.id === id ? { ...card, text: trimmed } : card,
    );
    this.cardsSubject.next(next);
    this.stopEditing();
  }

  deleteCard(id: string): void {
    const removed = this.cardsSubject.value.find((card) => card.id === id);
    if (!removed) {
      return;
    }
    const remaining = this.cardsSubject.value.filter((card) => card.id !== id);
    const renumbered = this.renumberSection(remaining, removed.sectionId);
    this.cardsSubject.next(renumbered);
    if (this.editingCardIdSubject.value === id) {
      this.stopEditing();
    }
  }

  incrementVote(id: string): void {
    const next = this.cardsSubject.value.map((card) =>
      card.id === id ? { ...card, votes: card.votes + 1 } : card,
    );
    this.cardsSubject.next(next);
  }

  moveCard(cardId: string, newSectionId: SectionType, newOrder: number): void {
    const current = this.cardsSubject.value;
    const moved = current.find((card) => card.id === cardId);
    if (!moved) {
      return;
    }

    const oldSectionId = moved.sectionId;
    const others = current.filter((card) => card.id !== cardId);

    const destination = others
      .filter((card) => card.sectionId === newSectionId)
      .sort((a, b) => a.order - b.order);

    const insertAt = Math.max(0, Math.min(newOrder, destination.length));
    destination.splice(insertAt, 0, { ...moved, sectionId: newSectionId });

    const renumberedDestination = destination.map((card, index) => ({ ...card, order: index }));

    let next: Card[] = others.filter((card) => card.sectionId !== newSectionId);
    next = [...next, ...renumberedDestination];

    if (oldSectionId !== newSectionId) {
      next = this.renumberSection(next, oldSectionId);
    }

    this.cardsSubject.next(next);
  }

  setViewFilter(filter: ViewFilter): void {
    this.viewFilterSubject.next(filter);
  }

  setSortOption(sort: SortOption): void {
    this.sortOptionSubject.next(sort);
  }

  startEditing(id: string): void {
    this.editingCardIdSubject.next(id);
  }

  stopEditing(): void {
    if (this.editingCardIdSubject.value !== null) {
      this.editingCardIdSubject.next(null);
    }
  }

  private renumberSection(cards: Card[], sectionId: SectionType): Card[] {
    const sectionCards = cards
      .filter((card) => card.sectionId === sectionId)
      .sort((a, b) => a.order - b.order)
      .map((card, index) => ({ ...card, order: index }));
    const otherCards = cards.filter((card) => card.sectionId !== sectionId);
    return [...otherCards, ...sectionCards];
  }

  private deriveVisibleCardsBySection(
    cards: Card[],
    filter: ViewFilter,
    sort: SortOption,
  ): CardsBySection {
    const result = emptyCardsBySection();
    for (const card of cards) {
      if (filter !== 'all' && filter !== card.sectionId) {
        continue;
      }
      result[card.sectionId].push(card);
    }
    for (const sectionId of VALID_SECTION_IDS) {
      result[sectionId] = this.sortCards(result[sectionId], sort);
    }
    return result;
  }

  private sortCards(cards: Card[], sort: SortOption): Card[] {
    const copy = [...cards];
    switch (sort) {
      case 'created-desc':
        return copy.sort((a, b) => b.createdAt - a.createdAt);
      case 'created-asc':
        return copy.sort((a, b) => a.createdAt - b.createdAt);
      case 'votes-desc':
        return copy.sort((a, b) => b.votes - a.votes || b.createdAt - a.createdAt);
    }
  }

  private loadFromStorage(): Card[] {
    try {
      const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
      if (!raw) {
        return [];
      }
      const parsed: unknown = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        return [];
      }
      return parsed.filter((item): item is Card => this.isValidCard(item));
    } catch {
      return [];
    }
  }

  private saveToStorage(cards: Card[]): void {
    try {
      if (typeof localStorage === 'undefined') {
        return;
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
    } catch {
      /* quota or serialization errors are swallowed */
    }
  }

  private isValidCard(value: unknown): value is Card {
    if (!value || typeof value !== 'object') {
      return false;
    }
    const candidate = value as Record<string, unknown>;
    return (
      typeof candidate['id'] === 'string' &&
      typeof candidate['text'] === 'string' &&
      typeof candidate['sectionId'] === 'string' &&
      VALID_SECTION_IDS.includes(candidate['sectionId'] as SectionType) &&
      typeof candidate['createdAt'] === 'number' &&
      typeof candidate['votes'] === 'number' &&
      typeof candidate['order'] === 'number'
    );
  }

  private generateId(): string {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return `card-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }
}
