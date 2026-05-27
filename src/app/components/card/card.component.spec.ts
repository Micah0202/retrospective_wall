import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Card } from '../../models/card.model';
import { CardComponent } from './card.component';

function makeCard(overrides: Partial<Card> = {}): Card {
  return {
    id: 'card-1',
    text: 'hello world',
    sectionId: 'went-well',
    createdAt: 1700000000000,
    votes: 3,
    order: 0,
    ...overrides,
  };
}

describe('CardComponent', () => {
  let fixture: ComponentFixture<CardComponent>;
  let component: CardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [CardComponent] }).compileComponents();
    fixture = TestBed.createComponent(CardComponent);
    component = fixture.componentInstance;
    component.card = makeCard();
    fixture.detectChanges();
  });

  it('renders the card text', () => {
    const text = (fixture.nativeElement as HTMLElement).querySelector('.retro-card__text');
    expect(text?.textContent?.trim()).toBe('hello world');
  });

  it('emits voteIncremented when the vote chip is clicked', () => {
    const spy = jasmine.createSpy('voteIncremented');
    component.voteIncremented.subscribe(spy);
    const voteBtn = (fixture.nativeElement as HTMLElement).querySelector('.retro-card__vote') as HTMLButtonElement;
    voteBtn.click();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('emits deleted when the delete button is clicked', () => {
    const spy = jasmine.createSpy('deleted');
    component.deleted.subscribe(spy);
    const deleteBtn = (fixture.nativeElement as HTMLElement).querySelector('.retro-card__delete') as HTMLButtonElement;
    deleteBtn.click();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('emits editRequested when the card body is clicked', () => {
    const spy = jasmine.createSpy('editRequested');
    component.editRequested.subscribe(spy);
    (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>('.retro-card')!.click();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('emits textSaved with the typed value when Enter is pressed in inline edit mode', () => {
    component.onInlineInput('fresh text');
    const spy = jasmine.createSpy('textSaved');
    component.textSaved.subscribe(spy);
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    spyOn(event, 'preventDefault');
    component.onInlineKeydown(event);
    expect(event.preventDefault).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith('fresh text');
  });

  it('does not emit textSaved when Shift+Enter is pressed in inline edit mode', () => {
    component.onInlineInput('multi');
    const spy = jasmine.createSpy('textSaved');
    component.textSaved.subscribe(spy);
    const event = new KeyboardEvent('keydown', { key: 'Enter', shiftKey: true });
    component.onInlineKeydown(event);
    expect(spy).not.toHaveBeenCalled();
  });
});
