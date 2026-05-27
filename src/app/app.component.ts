import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { BoardComponent } from './components/board/board.component';
import { EditCardModalComponent } from './components/edit-card-modal/edit-card-modal.component';
import { PreloaderComponent } from './components/preloader/preloader.component';

const PRELOADER_DURATION_MS = 800;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BoardComponent, EditCardModalComponent, PreloaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
  private readonly cdr = inject(ChangeDetectorRef);

  showPreloader = true;
  private timeoutId: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    this.timeoutId = setTimeout(() => {
      this.showPreloader = false;
      this.timeoutId = null;
      this.cdr.markForCheck();
    }, PRELOADER_DURATION_MS);
  }

  ngOnDestroy(): void {
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
    }
  }
}
