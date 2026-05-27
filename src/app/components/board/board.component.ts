import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Card,
  CardsBySection,
  SECTION_CONFIGS,
  SectionType,
  SortOption,
  ViewFilter,
} from '../../models/card.model';
import { RetrospectiveService } from '../../services/retrospective.service';
import { SectionComponent } from '../section/section.component';
import { ToolbarComponent } from '../toolbar/toolbar.component';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [AsyncPipe, SectionComponent, ToolbarComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardComponent {
  private readonly service = inject(RetrospectiveService);

  readonly sections = SECTION_CONFIGS;
  readonly connectedDropListIds: string[] = SECTION_CONFIGS.map((s) => s.id);

  readonly cardsBySection$: Observable<CardsBySection> = this.service.visibleCardsBySection$;
  readonly viewFilter$: Observable<ViewFilter> = this.service.viewFilter$;
  readonly sortOption$: Observable<SortOption> = this.service.sortOption$;

  newlyAddedCardId: string | null = null;

  onAdd(sectionId: SectionType): void {
    this.newlyAddedCardId = this.service.addCard(sectionId);
  }

  onTextSaved(payload: { id: string; text: string }): void {
    this.service.updateCardText(payload.id, payload.text);
    if (payload.id === this.newlyAddedCardId) {
      this.newlyAddedCardId = null;
    }
  }

  onVoteIncremented(id: string): void {
    this.service.incrementVote(id);
  }

  onDeleted(id: string): void {
    if (id === this.newlyAddedCardId) {
      this.newlyAddedCardId = null;
    }
    this.service.deleteCard(id);
  }

  onEditRequested(id: string): void {
    this.service.startEditing(id);
  }

  onDrop(event: CdkDragDrop<Card[]>): void {
    const card = event.item.data as Card;
    const targetSectionId = event.container.id as SectionType;
    this.service.moveCard(card.id, targetSectionId, event.currentIndex);
  }

  onViewFilterChanged(filter: ViewFilter): void {
    this.service.setViewFilter(filter);
  }

  onSortOptionChanged(sort: SortOption): void {
    this.service.setSortOption(sort);
  }
}
