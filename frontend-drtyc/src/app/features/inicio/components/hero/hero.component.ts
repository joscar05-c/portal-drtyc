import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { SlicePipe } from '@angular/common';
import { PortalService } from '../../../../core/services/portal.service';
import { Banner } from '../../../../core/interfaces/banner.model';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [SlicePipe],
  templateUrl: './hero.component.html',
})
export class HeroComponent implements OnInit, OnDestroy {
  private portalService = inject(PortalService);
  banners = signal<Banner[]>([]);
  currentIndex = signal(0);
  private timer: ReturnType<typeof setInterval> | null = null;
  private apiUrl = environment.apiUrl.replace('/api/v1', '');

  ngOnInit(): void {
    this.portalService.getBanners().subscribe({
      next: (data) => {
        this.banners.set(data);
        if (data.length > 1) {
          this.startTimer();
        }
      },
      error: () => {},
    });
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  prev(): void {
    const total = this.banners().length;
    this.currentIndex.set((this.currentIndex() - 1 + total) % total);
    this.resetTimer();
  }

  next(): void {
    const total = this.banners().length;
    this.currentIndex.set((this.currentIndex() + 1) % total);
    this.resetTimer();
  }

  goTo(i: number): void {
    this.currentIndex.set(i);
    this.resetTimer();
  }

  getImageUrl(path: string): string {
    return `${this.apiUrl}/storage/${path}`;
  }

  private startTimer(): void {
    this.timer = setInterval(() => {
      this.currentIndex.set((this.currentIndex() + 1) % this.banners().length);
    }, 7000);
  }

  private stopTimer(): void {
    if (this.timer) clearInterval(this.timer);
  }

  private resetTimer(): void {
    this.stopTimer();
    if (this.banners().length > 1) this.startTimer();
  }
}
