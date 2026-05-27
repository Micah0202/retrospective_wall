import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SECTION_CONFIGS } from '../../models/card.model';
import { SectionComponent } from './section.component';

describe('SectionComponent', () => {
  let fixture: ComponentFixture<SectionComponent>;
  let component: SectionComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [SectionComponent] }).compileComponents();
    fixture = TestBed.createComponent(SectionComponent);
    component = fixture.componentInstance;
    component.config = SECTION_CONFIGS[0];
    component.cards = [];
    component.connectedDropListIds = SECTION_CONFIGS.map((s) => s.id);
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(component).toBeTruthy();
  });

  it('renders the section title', () => {
    const title = (fixture.nativeElement as HTMLElement).querySelector('.retro-section__title');
    expect(title?.textContent?.trim()).toBe(SECTION_CONFIGS[0].title);
  });

  it('emits addRequested when the + button is clicked', () => {
    const spy = jasmine.createSpy('addRequested');
    component.addRequested.subscribe(spy);
    (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>('.retro-section__add')!.click();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('shows the empty placeholder when there are no cards', () => {
    const empty = (fixture.nativeElement as HTMLElement).querySelector('.retro-section__empty');
    expect(empty).not.toBeNull();
  });
});
