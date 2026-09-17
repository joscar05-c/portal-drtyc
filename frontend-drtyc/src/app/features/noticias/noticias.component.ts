import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, catchError, of } from 'rxjs';
import { PortalService } from '../../core/services/portal.service';
import { Post } from '../../core/interfaces/post.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-noticias',
  standalone: true,
  imports: [RouterLink, DatePipe, UpperCasePipe],
  template: `
    <div class="max-w-7xl mx-auto px-gutter py-space-xl">
      <section class="w-full">
      <div class="mb-space-xl">
        <div class="flex items-center gap-space-xs text-secondary text-label-md uppercase tracking-wider mb-1">
          <span class="material-symbols-outlined text-[18px]">newspaper</span>
          <span>Actualidad y Difusi\u00f3n</span>
        </div>
        <h1 class="text-headline-xl text-primary font-bold mb-space-sm">Todas las Noticias</h1>
        <p class="text-body-lg text-on-surface-variant">Mant\u00e9ngase informado con las \u00faltimas noticias y comunicados oficiales de la DRTC.</p>
      </div>

      <div class="w-full md:w-96 relative mb-space-lg">
        <input class="w-full h-11 pl-space-md pr-10 rounded bg-surface-container-lowest text-on-surface text-body-sm shadow-sm focus:outline-none focus:bg-surface-container-low transition-all"
               placeholder="Buscar noticia..."
               type="text"
               [value]="busqueda()"
               (input)="onBusqueda($event)">
        <span class="material-symbols-outlined absolute right-3 top-3 text-outline text-[20px]">search</span>
      </div>

      @if (filtradas().length > 0) {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
          @for (noticia of filtradas(); track noticia.id) {
            <article class="bg-surface-container-lowest rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col h-full group">
              @if (noticia.image_path) {
                <div class="relative w-full h-48 md:h-56 overflow-hidden">
                  <img class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                       [src]="getImageUrl(noticia.image_path)" [alt]="noticia.title">
                  @if (noticia.category) {
                    <div class="absolute top-space-sm left-space-sm">
                      <span class="px-space-sm py-0.5 rounded-full text-label-sm font-bold bg-primary text-on-primary shadow-sm">
                        {{ noticia.category.name | uppercase }}
                      </span>
                    </div>
                  }
                </div>
              }
              <div class="p-space-md flex-1 flex flex-col">
                <span class="text-label-sm text-outline mb-space-xs block">{{ noticia.published_at | date:'dd MMMM yyyy':'':'es' }}</span>
                <h3 class="font-headline-sm text-headline-sm text-on-surface font-bold mb-space-xs line-clamp-2">
                  {{ noticia.title }}
                </h3>
                <p class="font-body-sm text-body-sm text-on-surface-variant line-clamp-3 mb-space-sm">
                  {{ noticia.excerpt }}
                </p>
                <div class="mt-auto">
                  <a [routerLink]="['/noticias', noticia.slug]"
                     class="inline-flex items-center gap-1 text-label-md text-secondary font-bold cursor-pointer">
                    <span>Leer m\u00e1s</span>
                    <span class="material-symbols-outlined text-[16px]">east</span>
                  </a>
                </div>
              </div>
            </article>
          }
        </div>
      } @else {
        <div class="p-12 text-center bg-surface-container-lowest rounded-lg shadow-sm">
          <span class="material-symbols-outlined text-[48px] text-outline mb-space-md block">search_off</span>
          <p class="text-headline-sm text-on-surface font-bold mb-1">No se encontraron noticias</p>
          <p class="text-body-sm text-on-surface-variant">Intenta con otros t\u00e9rminos de b\u00fasqueda</p>
        </div>
      }
    </section>
    </div>
  `,
})
export class NoticiasComponent {
  private portalService = inject(PortalService);
  private apiUrl = environment.apiUrl.replace('/api/v1', '');

  busqueda = signal('');

  private allPosts = toSignal(
    this.portalService.getPosts().pipe(
      map(res => res.data),
      catchError(() => of([] as Post[]))
    ),
    { initialValue: [] as Post[] }
  );

  filtradas = computed(() => {
    const q = this.busqueda().toLowerCase();
    const items = this.allPosts();
    if (!q) return items;
    return items.filter(n =>
      n.title.toLowerCase().includes(q) ||
      (n.excerpt && n.excerpt.toLowerCase().includes(q))
    );
  });

  onBusqueda(event: Event): void {
    this.busqueda.set((event.target as HTMLInputElement).value);
  }

  getImageUrl(path: string): string {
    return `${this.apiUrl}/storage/${path}`;
  }
}
