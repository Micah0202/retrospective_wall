import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Card, SectionConfig } from '../../models/card.model';
import { CardComponent } from '../card/card.component';

@Component({
  selector: 'app-section',
  standalone: true,
  imports: [CdkDropList, CdkDrag, CardComponent],
  templateUrl: './section.component.html',
  styleUrl: './section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionComponent {
  @Input({ required: true }) config!: SectionConfig;
  @Input({ required: true }) cards!: Card[];
  @Input() newlyAddedCardId: string | null = null;
  @Input({ required: true }) connectedDropListIds!: string[];

  @Output() addRequested = new EventEmitter<void>();
  @Output() cardTextSaved = new EventEmitter<{ id: string; text: string }>();
  @Output() cardVoteIncremented = new EventEmitter<string>();
  @Output() cardDeleted = new EventEmitter<string>();
  @Output() cardEditRequested = new EventEmitter<string>();
  @Output() cardMoved = new EventEmitter<CdkDragDrop<Card[]>>();

  trackById(_index: number, card: Card): string {
    return card.id;
  }

  onAdd(): void {
    this.addRequested.emit();
  }

  onTextSaved(id: string, text: string): void {
    this.cardTextSaved.emit({ id, text });
  }

  onDrop(event: CdkDragDrop<Card[]>): void {
    this.cardMoved.emit(event);
  }
}
