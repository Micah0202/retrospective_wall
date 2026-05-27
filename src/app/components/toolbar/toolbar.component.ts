import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import {
  SORT_OPTIONS,
  SortOption,
  VIEW_FILTER_OPTIONS,
  ViewFilter,
} from '../../models/card.model';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolbarComponent {
  @Input({ required: true }) viewFilter!: ViewFilter;
  @Input({ required: true }) sortOption!: SortOption;

  @Output() viewFilterChanged = new EventEmitter<ViewFilter>();
  @Output() sortOptionChanged = new EventEmitter<SortOption>();

  readonly viewOptions = VIEW_FILTER_OPTIONS;
  readonly sortOptions = SORT_OPTIONS;

  onViewChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as ViewFilter;
    this.viewFilterChanged.emit(value);
  }

  onSortChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as SortOption;
    this.sortOptionChanged.emit(value);
  }
}
