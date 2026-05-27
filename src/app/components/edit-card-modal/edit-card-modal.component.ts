import { AsyncPipe } from '@angular/common';
import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable, tap } from 'rxjs';
import { Card } from '../../models/card.model';
import { RetrospectiveService } from '../../services/retrospective.service';

@Component({
  selector: 'app-edit-card-modal',
  standalone: true,
  imports: [AsyncPipe, FormsModule],
  templateUrl: './edit-card-modal.component.html',
  styleUrl: './edit-card-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditCardModalComponent implements AfterViewChecked {
  private readonly service = inject(RetrospectiveService);

  @ViewChild('modalTextarea') textareaRef?: ElementRef<HTMLTextAreaElement>;

  draftText = '';
  private syncedCardId: string | null = null;
  private focusedCardId: string | null = null;

  readonly editingCard$: Observable<Card | null> = this.service.editingCard$.pipe(
    tap((card) => this.syncDraft(card)),
  );

  ngAfterViewChecked(): void {
    if (this.textareaRef && this.syncedCardId && this.focusedCardId !== this.syncedCardId) {
      const el = this.textareaRef.nativeElement;
      this.focusedCardId = this.syncedCardId;
      queueMicrotask(() => {
        el.focus();
        el.select();
      });
    }
  }

  onSave(card: Card): void {
    this.service.updateCardText(card.id, this.draftText);
  }

  onCancel(): void {
    this.service.stopEditing();
  }

  onKeydown(event: KeyboardEvent, card: Card): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.onCancel();
      return;
    }
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.onSave(card);
    }
  }

  onBackdropClick(): void {
    this.onCancel();
  }

  onModalClick(event: MouseEvent): void {
    event.stopPropagation();
  }

  private syncDraft(card: Card | null): void {
    if (card && card.id !== this.syncedCardId) {
      this.draftText = card.text;
      this.syncedCardId = card.id;
    }
    if (!card) {
      this.syncedCardId = null;
      this.focusedCardId = null;
      this.draftText = '';
    }
  }
}
