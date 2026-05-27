export type SectionType =
  | 'went-well'
  | 'improve'
  | 'start-doing'
  | 'action-items';

export type SortOption = 'created-desc' | 'created-asc' | 'votes-desc';

export type ViewFilter = SectionType | 'all';

export interface Card {
  id: string;
  text: string;
  sectionId: SectionType;
  createdAt: number;
  votes: number;
  order: number;
}

export interface SectionConfig {
  readonly id: SectionType;
  readonly title: string;
  readonly themeClass: string;
}

export const SECTION_CONFIGS: readonly SectionConfig[] = [
  { id: 'went-well', title: 'What went well', themeClass: 'retro-section--went-well' },
  { id: 'improve', title: 'What can be improved', themeClass: 'retro-section--improve' },
  { id: 'start-doing', title: 'Start doing', themeClass: 'retro-section--start-doing' },
  { id: 'action-items', title: 'Action Items', themeClass: 'retro-section--action-items' },
] as const;

export type CardsBySection = Record<SectionType, Card[]>;

export function emptyCardsBySection(): CardsBySection {
  return {
    'went-well': [],
    'improve': [],
    'start-doing': [],
    'action-items': [],
  };
}

export const VIEW_FILTER_OPTIONS: readonly { value: ViewFilter; label: string }[] = [
  { value: 'all', label: 'All Sections' },
  { value: 'went-well', label: 'What went well' },
  { value: 'improve', label: 'What can be improved' },
  { value: 'start-doing', label: 'Start doing' },
  { value: 'action-items', label: 'Action Items' },
] as const;

export const SORT_OPTIONS: readonly { value: SortOption; label: string }[] = [
  { value: 'created-desc', label: 'Created Time (newest first)' },
  { value: 'created-asc', label: 'Created Time (oldest first)' },
  { value: 'votes-desc', label: 'Votes (high to low)' },
] as const;
