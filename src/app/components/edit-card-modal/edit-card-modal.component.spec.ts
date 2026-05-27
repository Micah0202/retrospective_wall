import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RetrospectiveService } from '../../services/retrospective.service';
import { EditCardModalComponent } from './edit-card-modal.component';

describe('EditCardModalComponent', () => {
  let fixture: ComponentFixture<EditCardModalComponent>;
  let component: EditCardModalComponent;
  let service: RetrospectiveService;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [EditCardModalComponent],
      providers: [RetrospectiveService],
    }).compileComponents();
    fixture = TestBed.createComponent(EditCardModalComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(RetrospectiveService);
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(component).toBeTruthy();
  });

  it('does not render the modal when no card is being edited', () => {
    const backdrop = (fixture.nativeElement as HTMLElement).querySelector('.retro-modal__backdrop');
    expect(backdrop).toBeNull();
  });

  it('renders the modal once a card is being edited', () => {
    const id = service.addCard('went-well');
    service.updateCardText(id, 'edited me');
    service.startEditing(id);
    fixture.detectChanges();
    const backdrop = (fixture.nativeElement as HTMLElement).querySelector('.retro-modal__backdrop');
    expect(backdrop).not.toBeNull();
    expect(component.draftText).toBe('edited me');
  });
});
