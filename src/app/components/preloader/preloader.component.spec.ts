import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PreloaderComponent } from './preloader.component';

describe('PreloaderComponent', () => {
  let fixture: ComponentFixture<PreloaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [PreloaderComponent] }).compileComponents();
    fixture = TestBed.createComponent(PreloaderComponent);
    fixture.componentRef.setInput('visible', true);
    fixture.detectChanges();
  });

  it('creates and is visible by default', () => {
    const root = (fixture.nativeElement as HTMLElement).querySelector('.retro-preloader');
    expect(root).not.toBeNull();
    expect(root!.classList.contains('retro-preloader--hidden')).toBeFalse();
  });

  it('applies the hidden modifier when visible is false', () => {
    fixture.componentRef.setInput('visible', false);
    fixture.detectChanges();
    const root = (fixture.nativeElement as HTMLElement).querySelector('.retro-preloader');
    expect(root!.classList.contains('retro-preloader--hidden')).toBeTrue();
  });
});
