import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RetrospectiveService } from '../../services/retrospective.service';
import { BoardComponent } from './board.component';

describe('BoardComponent', () => {
  let fixture: ComponentFixture<BoardComponent>;
  let component: BoardComponent;
  let service: RetrospectiveService;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [BoardComponent],
      providers: [RetrospectiveService],
    }).compileComponents();
    fixture = TestBed.createComponent(BoardComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(RetrospectiveService);
    fixture.detectChanges();
  });

  it('renders four sections by default', () => {
    const sections = (fixture.nativeElement as HTMLElement).querySelectorAll('app-section');
    expect(sections.length).toBe(4);
  });

  it('calls service.addCard with the right section id when onAdd fires', () => {
    const spy = spyOn(service, 'addCard').and.callThrough();
    component.onAdd('improve');
    expect(spy).toHaveBeenCalledWith('improve');
  });

  it('renders only one section after setViewFilter selects a single one', () => {
    service.setViewFilter('start-doing');
    fixture.detectChanges();
    const sections = (fixture.nativeElement as HTMLElement).querySelectorAll('app-section');
    expect(sections.length).toBe(1);
  });
});
