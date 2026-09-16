import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { SlicePipe } from '@angular/common';
import { PortalService } from '../../../core/services/portal.service';
import { Banner } from '../../../core/interfaces/banner.model';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [SlicePipe],
  template: `
    @if (banners().length > 0) {
      <section class="relative w-full rounded-xl overflow-hidden shadow-xl bg-primary text-on-primary mb-space-xl">
        <div class="relative w-full min-h-[460px] md:min-h-[520px] flex items-center">
          @for (banner of banners(); track banner.id; let i = $index) {
            <div class="transition-opacity duration-700 ease-in-out absolute inset-0 w-full h-full flex items-center"
                 [class.opacity-100]="currentIndex() === i"
                 [class.opacity-0]="currentIndex() !== i"
                 [class.pointer-events-none]="currentIndex() !== i"
                 [class.z-10]="currentIndex() === i"
                 [class.z-0]="currentIndex() !== i">
              <!-- Background image -->
              <a [href]="banner.url || '#'" class="block w-full h-full">
                <div class="absolute inset-0 bg-cover bg-center" [style.background-image]="'url(' + getImageUrl(banner.image_path) + ')'"></div>
                <div class="absolute inset-0 bg-gradient-to-r from-primary via-primary/85 to-transparent"></div>
              </a>

              <!-- Content overlay -->
              <div class="absolute left-0 top-0 max-w-2xl px-space-lg md:px-space-xl py-space-xl z-20 flex flex-col items-start">
                @if (banner.badge) {
                  <div class="inline-flex items-center gap-space-xs bg-error text-on-error px-space-md py-1 rounded-full text-label-sm font-bold mb-space-md shadow-sm">
                    <span class="material-symbols-outlined text-[16px]">verified_user</span>
                    <span>{{ banner.badge }}</span>
                  </div>
                }

                <h2 class="font-bold text-headline-xl tracking-tight mb-space-sm leading-tight text-on-primary">
                  {{ banner.title }}
                </h2>

                @if (banner.description) {
                  <p class="text-body-lg text-surface-variant mb-space-lg leading-relaxed">
                    {{ banner.description }}
                  </p>
                }

                @if (banner.url) {
                  <a class="h-11 px-space-lg rounded bg-secondary hover:bg-on-secondary-fixed-variant text-on-secondary font-semibold flex items-center gap-space-xs shadow-md transition-all"
                     [href]="banner.url">
                    @if (banner.button_icon) {
                      <span class="material-symbols-outlined text-[18px]">{{ banner.button_icon }}</span>
                    } @else {
                      <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
                    }
                    <span>{{ banner.button_text || 'Conocer más' }}</span>
                  </a>
                }
              </div>
            </div>
          }
        </div>

        @if (banners().length > 1) {
          <!-- Controls -->
          <button (click)="prev()" class="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none">
            <span class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50 transition-all">
              <span class="material-symbols-outlined text-white text-[20px]">chevron_left</span>
            </span>
          </button>
          <button (click)="next()" class="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none">
            <span class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50 transition-all">
              <span class="material-symbols-outlined text-white text-[20px]">chevron_right</span>
            </span>
          </button>

          <!-- Indicators bar -->
          <div class="relative z-30 bg-primary-container px-space-md py-space-sm flex flex-col sm:flex-row items-center justify-between gap-space-sm">
            <div class="flex items-center gap-space-xs overflow-x-auto w-full sm:w-auto">
              @for (banner of banners(); track banner.id; let i = $index) {
                <button (click)="goTo(i)"
                        class="px-space-md py-2 rounded text-label-sm font-semibold transition-all flex items-center gap-space-xs"
                        [class.bg-surface-container-lowest]="currentIndex() === i"
                        [class.text-primary]="currentIndex() === i"
                        [class.font-bold]="currentIndex() === i"
                        [class.shadow-sm]="currentIndex() === i"
                        [class.text-surface-variant]="currentIndex() !== i"
                        [class.hover:bg-primary]="currentIndex() !== i"
                        [class.hover:text-on-primary]="currentIndex() !== i">
                  <span class="w-2 h-2 rounded-full" [class.bg-secondary]="currentIndex() === i" [class.bg-surface-variant]="currentIndex() !== i"></span>
                  <span>{{ i + 1 }}. {{ banner.title | slice:0:30 }}</span>
                </button>
              }
            </div>
            <div class="hidden sm:flex items-center gap-space-xs text-label-sm text-surface-variant">
              <span class="material-symbols-outlined text-[16px]">info</span>
              <span>Atención presencial: Lunes a Viernes 08:00 a 16:30</span>
            </div>
          </div>
        }
      </section>
    }
  `,
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
