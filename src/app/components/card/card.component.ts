import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { Card } from '../../models/card.model';

@Component({
  selector: 'app-card',
  standalone: true,
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent implements AfterViewInit {
  @Input({ required: true }) card!: Card;
  @Input() isEditingInline = false;
  @Input() rotationIndex = 0;

  get rotationDegrees(): number {
    return 0;
  }

  @Output() textSaved = new EventEmitter<string>();
  @Output() voteIncremented = new EventEmitter<void>();
  @Output() deleted = new EventEmitter<void>();
  @Output() editRequested = new EventEmitter<void>();

  @ViewChild('inlineTextarea') textareaRef?: ElementRef<HTMLTextAreaElement>;

  draftText = '';

  ngAfterViewInit(): void {
    if (this.isEditingInline && this.textareaRef) {
      const el = this.textareaRef.nativeElement;
      el.value = this.card.text;
      this.draftText = this.card.text;
      queueMicrotask(() => el.focus());
    }
  }

  onInlineInput(value: string): void {
    this.draftText = value;
  }

  onInlineKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.saveInline();
    }
  }

  onInlineBlur(): void {
    this.saveInline();
  }

  onVoteClick(event: MouseEvent): void {
    event.stopPropagation();
    this.voteIncremented.emit();
  }

  onDeleteClick(event: MouseEvent): void {
    event.stopPropagation();
    this.deleted.emit();
  }

  onBodyClick(): void {
    if (!this.isEditingInline) {
      this.editRequested.emit();
    }
  }

  onBodyKeydown(event: KeyboardEvent): void {
    if (this.isEditingInline) {
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.editRequested.emit();
    }
  }

  private saveInline(): void {
    this.textSaved.emit(this.draftText);
  }
}
