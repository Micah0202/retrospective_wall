import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { Card, SectionType } from '../models/card.model';
import { RetrospectiveService } from './retrospective.service';

describe('RetrospectiveService', () => {
  let service: RetrospectiveService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [RetrospectiveService] });
    service = TestBed.inject(RetrospectiveService);
  });

  function snapshot(): Card[] {
    let value: Card[] = [];
    service.cards$.subscribe((cards) => (value = cards)).unsubscribe();
    return value;
  }

  function addCardWithText(sectionId: SectionType, text: string): string {
    const id = service.addCard(sectionId);
    service.updateCardText(id, text);
    return id;
  }

  it('creates a card in the right section with sensible defaults', () => {
    const id = service.addCard('went-well');
    const cards = snapshot();
    expect(cards.length).toBe(1);
    const created = cards[0];
    expect(created.id).toBe(id);
    expect(created.sectionId).toBe('went-well');
    expect(created.text).toBe('');
    expect(created.votes).toBe(0);
    expect(created.order).toBe(0);
    expect(typeof created.createdAt).toBe('number');
  });

  it('returns a unique id from addCard and assigns increasing order per section', () => {
    const a = service.addCard('improve');
    const b = service.addCard('improve');
    const c = service.addCard('went-well');
    const cards = snapshot();
    expect(new Set([a, b, c]).size).toBe(3);
    const improveCards = cards.filter((card) => card.sectionId === 'improve');
    expect(improveCards.map((card) => card.order).sort()).toEqual([0, 1]);
    const wentWell = cards.filter((card) => card.sectionId === 'went-well');
    expect(wentWell[0].order).toBe(0);
  });

  it('updates the card text immutably without touching other cards', () => {
    const a = addCardWithText('improve', 'first');
    const b = addCardWithText('improve', 'second');
    service.updateCardText(a, 'updated');
    const cards = snapshot();
    const found = cards.find((card) => card.id === a)!;
    const other = cards.find((card) => card.id === b)!;
    expect(found.text).toBe('updated');
    expect(other.text).toBe('second');
  });

  it('removes the card when updateCardText receives an empty/whitespace string', () => {
    const id = addCardWithText('start-doing', 'temp');
    service.updateCardText(id, '   ');
    expect(snapshot().find((card) => card.id === id)).toBeUndefined();
  });

  it('deletes a card by id and re-numbers remaining cards in that section', () => {
    const first = addCardWithText('action-items', 'one');
    const second = addCardWithText('action-items', 'two');
    const third = addCardWithText('action-items', 'three');
    service.deleteCard(second);
    const cards = snapshot()
      .filter((card) => card.sectionId === 'action-items')
      .sort((a, b) => a.order - b.order);
    expect(cards.length).toBe(2);
    expect(cards.map((card) => card.id)).toEqual([first, third]);
    expect(cards.map((card) => card.order)).toEqual([0, 1]);
  });

  it('incrementVote increases the vote count by 1 without mutating the original', () => {
    const id = addCardWithText('went-well', 'voted');
    const before = snapshot().find((card) => card.id === id)!;
    service.incrementVote(id);
    const after = snapshot().find((card) => card.id === id)!;
    expect(after.votes).toBe(before.votes + 1);
    expect(after).not.toBe(before);
  });

  it('moveCard updates sectionId and re-numbers order densely from 0 in both sections', () => {
    const a = addCardWithText('went-well', 'a');
    const b = addCardWithText('went-well', 'b');
    const c = addCardWithText('went-well', 'c');
    service.moveCard(b, 'improve', 0);
    const all = snapshot();
    const went = all.filter((card) => card.sectionId === 'went-well').sort((x, y) => x.order - y.order);
    const improve = all.filter((card) => card.sectionId === 'improve').sort((x, y) => x.order - y.order);
    expect(went.map((card) => card.id)).toEqual([a, c]);
    expect(went.map((card) => card.order)).toEqual([0, 1]);
    expect(improve.map((card) => card.id)).toEqual([b]);
    expect(improve.map((card) => card.order)).toEqual([0]);
  });

  it('setViewFilter restricts the visibleCardsBySection output to the chosen section', async () => {
    addCardWithText('went-well', 'kept');
    addCardWithText('improve', 'hidden');
    service.setViewFilter('went-well');
    const visible = await firstValueFrom(service.visibleCardsBySection$);
    expect(visible['went-well'].length).toBe(1);
    expect(visible['improve'].length).toBe(0);
    expect(visible['start-doing'].length).toBe(0);
    expect(visible['action-items'].length).toBe(0);
  });
});
