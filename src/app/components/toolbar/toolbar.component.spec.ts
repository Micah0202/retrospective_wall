import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToolbarComponent } from './toolbar.component';

describe('ToolbarComponent', () => {
  let fixture: ComponentFixture<ToolbarComponent>;
  let component: ToolbarComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ToolbarComponent] }).compileComponents();
    fixture = TestBed.createComponent(ToolbarComponent);
    component = fixture.componentInstance;
    component.viewFilter = 'all';
    component.sortOption = 'created-desc';
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(component).toBeTruthy();
  });

  it('emits viewFilterChanged when the view select changes', () => {
    const spy = jasmine.createSpy('viewChanged');
    component.viewFilterChanged.subscribe(spy);
    const select = (fixture.nativeElement as HTMLElement).querySelectorAll('select')[0] as HTMLSelectElement;
    select.value = 'improve';
    select.dispatchEvent(new Event('change'));
    expect(spy).toHaveBeenCalledWith('improve');
  });

  it('emits sortOptionChanged when the sort select changes', () => {
    const spy = jasmine.createSpy('sortChanged');
    component.sortOptionChanged.subscribe(spy);
    const select = (fixture.nativeElement as HTMLElement).querySelectorAll('select')[1] as HTMLSelectElement;
    select.value = 'votes-desc';
    select.dispatchEvent(new Event('change'));
    expect(spy).toHaveBeenCalledWith('votes-desc');
  });
});
