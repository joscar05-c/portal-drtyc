import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { PortalService } from '../../../core/services/portal.service';
import { Post } from '../../../core/interfaces/post.model';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [RouterLink, DatePipe, UpperCasePipe],
  template: `
    <section class="w-full mb-space-xl">
      <div class="flex flex-col md:flex-row md:items-end justify-between mb-space-lg gap-space-md">
        <div>
          <div class="flex items-center gap-space-xs text-secondary text-label-md uppercase tracking-wider mb-1">
            <span class="material-symbols-outlined text-[18px]">newspaper</span>
            <span>Actualidad y Difusión</span>
          </div>
          <h2 class="text-headline-lg text-primary font-bold">Noticias y Comunicados Oficiales</h2>
        </div>
      </div>

      @if (cargando()) {
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
          <div class="lg:col-span-7 bg-surface-container-lowest rounded-lg shadow-sm animate-pulse h-72"></div>
          <div class="lg:col-span-5 flex flex-col gap-space-md">
            @for (i of [1, 2, 3]; track i) {
              <div class="bg-surface-container-lowest rounded-lg shadow-sm animate-pulse h-36"></div>
            }
          </div>
        </div>
      } @else if (noticias().length > 0) {
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
          <!-- Noticia Principal -->
          <article class="lg:col-span-7 bg-surface-container-lowest rounded-lg shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col">
            @if (noticias()[0].image_path) {
              <div class="relative w-full h-72 overflow-hidden">
                <img class="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                     [src]="getImageUrl(noticias()[0].image_path!)" [alt]="noticias()[0].title">
                <div class="absolute top-space-md left-space-md flex gap-space-xs">
                  @if (noticias()[0].category) {
                    <span class="px-space-md py-1 rounded-full text-label-sm font-bold bg-primary text-on-primary shadow-sm">
                      {{ noticias()[0].category!.name | uppercase }}
                    </span>
                  }
                  <span class="px-space-md py-1 rounded-full text-label-sm font-semibold bg-surface-container-lowest/90 backdrop-blur-sm text-on-surface shadow-sm">
                    {{ noticias()[0].published_at | date:'dd MMMM yyyy':'':'es' | uppercase }}
                  </span>
                </div>
              </div>
            }
            <div class="p-space-lg flex-1 flex flex-col justify-between">
              <div>
                <h3 class="text-headline-md text-primary font-bold hover:text-secondary transition-colors mb-space-sm leading-snug">
                  {{ noticias()[0].title }}
                </h3>
                <p class="text-body-md text-on-surface-variant mb-space-md line-clamp-3">
                  {{ noticias()[0].excerpt }}
                </p>
              </div>
              <div class="flex items-center justify-between pt-space-md">
                <a class="inline-flex items-center gap-1 text-label-lg text-secondary hover:underline font-bold" [routerLink]="['/noticias', noticias()[0].slug]">
                  <span>Leer Nota Completa</span>
                  <span class="material-symbols-outlined text-[18px]">chevron_right</span>
                </a>
              </div>
            </div>
          </article>

          <!-- Noticias Secundarias -->
          <div class="lg:col-span-5 flex flex-col gap-space-md">
            @for (noticia of noticias().slice(1, 4); track noticia.id) {
              <article class="bg-surface-container-lowest p-space-md rounded-lg shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div class="flex items-start justify-between gap-space-xs mb-2">
                    @if (noticia.category) {
                      <span class="px-space-sm py-0.5 rounded text-label-sm font-bold bg-surface-container text-secondary">
                        {{ noticia.category.name | uppercase }}
                      </span>
                    }
                    <span class="text-label-sm text-outline">{{ noticia.published_at | date:'dd MMM yyyy':'':'es' }}</span>
                  </div>
                  <h4 class="text-headline-sm text-on-surface font-semibold hover:text-secondary transition-colors mb-space-xs line-clamp-2">
                    {{ noticia.title }}
                  </h4>
                  <p class="text-body-sm text-on-surface-variant line-clamp-2 mb-space-sm">
                    {{ noticia.excerpt }}
                  </p>
                </div>
                <a class="inline-flex items-center gap-1 text-label-md text-secondary font-bold self-start" [routerLink]="['/noticias', noticia.slug]">
                  <span>Leer más</span>
                  <span class="material-symbols-outlined text-[16px]">east</span>
                </a>
              </article>
            }
          </div>
        </div>
      } @else {
        <div class="p-12 text-center bg-surface-container-lowest rounded-lg shadow-sm">
          <span class="material-symbols-outlined text-[48px] text-outline mb-space-md block">newspaper</span>
          <p class="text-headline-sm text-on-surface font-bold mb-1">No hay noticias disponibles</p>
          <p class="text-body-sm text-on-surface-variant">Vuelve a consultar más tarde</p>
        </div>
      }
    </section>
  `,
})
export class NewsComponent implements OnInit {
  private portalService = inject(PortalService);
  noticias = signal<Post[]>([]);
  cargando = signal(true);
  private apiUrl = environment.apiUrl.replace('/api/v1', '');

  ngOnInit(): void {
    this.portalService.getPosts().subscribe({
      next: (res) => {
        this.noticias.set(res.data.slice(0, 4));
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }

  getImageUrl(path: string): string {
    return `${this.apiUrl}/storage/${path}`;
  }
}
