import { Injectable, signal, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private platformId = inject(PLATFORM_ID);
  dark = signal(false);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem('theme');
      if (saved === 'dark') {
        this.dark.set(true);
        document.documentElement.classList.add('dark');
      } else if (saved === 'light') {
        this.dark.set(false);
        document.documentElement.classList.remove('dark');
      } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.dark.set(prefersDark);
        if (prefersDark) {
          document.documentElement.classList.add('dark');
        }
      }

      effect(() => {
        const isDark = this.dark();
        if (isDark) {
          document.documentElement.classList.add('dark');
          localStorage.setItem('theme', 'dark');
        } else {
          document.documentElement.classList.remove('dark');
          localStorage.setItem('theme', 'light');
        }
      });
    }
  }

  toggle(): void {
    this.dark.set(!this.dark());
  }
}
