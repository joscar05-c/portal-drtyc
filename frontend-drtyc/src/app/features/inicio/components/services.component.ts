import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { PortalService } from '../../../core/services/portal.service';
import { QuickLink } from '../../../core/interfaces/quick-link.model';

@Component({
  selector: 'app-services',
  standalone: true,
  template: `
    <section class="w-full mb-space-xl" id="tramites">
      <div class="flex flex-col md:flex-row md:items-end justify-between mb-space-lg gap-space-md">
        <div>
          <div class="flex items-center gap-space-xs text-secondary font-label-md text-label-md uppercase tracking-wider mb-1">
            <span class="material-symbols-outlined text-[18px]">touch_app</span>
            <span>Plataforma de Atenci\u00f3n Virtual</span>
          </div>
          <h2 class="font-headline-lg text-headline-lg text-primary font-bold">Servicios y Tr\u00e1mites Digitales Frecuentes</h2>
        </div>
        <div class="w-full md:w-80 relative">
          <input class="w-full h-11 pl-space-md pr-10 rounded bg-surface-container-lowest text-on-surface text-body-sm font-body-sm shadow-sm focus:outline-none focus:bg-surface-container-low transition-all"
                 placeholder="Buscar tr\u00e1mite: brevete, TUC, r\u00e9cord..."
                 type="text"
                 [value]="busqueda()"
                 (input)="onBusqueda($event)">
          <span class="material-symbols-outlined absolute right-3 top-3 text-outline text-[20px]">search</span>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-md">
        @for (tramite of tramitesFiltrados(); track tramite.id) {
          <div class="p-space-lg rounded-lg bg-surface-container-lowest shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div class="flex items-start justify-between gap-space-sm mb-space-md">
                <div class="w-12 h-12 rounded flex items-center justify-center transition-colors"
                     [class]="getIconBg(tramite)">
                  <span class="material-symbols-outlined text-[28px]">{{ tramite.icon || 'link' }}</span>
                </div>
                <span class="px-space-sm py-0.5 rounded text-label-sm font-label-sm font-bold"
                      [class]="getBadgeClass(tramite)">{{ tramite.badge_text }}</span>
              </div>
              <h3 class="font-headline-sm text-headline-sm text-on-surface group-hover:text-secondary font-bold mb-space-xs transition-colors">
                {{ tramite.title }}
              </h3>
              <p class="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                {{ tramite.description }}
              </p>
            </div>
            <div class="pt-space-sm flex items-center justify-between">
              <span class="font-label-sm text-label-sm text-outline">{{ tramite.footer_info }}</span>
              <a class="font-label-md text-label-md text-secondary font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                 [href]="tramite.url">
                <span>{{ tramite.button_text }}</span>
                <span class="material-symbols-outlined text-[16px]">{{ tramite.button_icon || 'arrow_forward' }}</span>
              </a>
            </div>
          </div>
        } @empty {
          @if (busqueda()) {
            <div class="col-span-full text-center py-space-xl">
              <span class="material-symbols-outlined text-[48px] text-outline mb-space-sm block">search_off</span>
              <p class="text-body-lg text-on-surface-variant">No se encontraron tr\u00e1mites que coincidan con "{{ busqueda() }}"</p>
            </div>
          }
        }
      </div>
    </section>
  `,
})
export class ServicesComponent implements OnInit {
  private portalService = inject(PortalService);

  busqueda = signal('');
  private servicios = signal<QuickLink[]>([]);

  tramitesFiltrados = computed(() => {
    const q = this.busqueda().toLowerCase();
    const items = this.servicios();
    if (!q) return items;
    return items.filter(s =>
      s.title.toLowerCase().includes(q) ||
      (s.description && s.description.toLowerCase().includes(q))
    );
  });

  ngOnInit(): void {
    this.portalService.getQuickLinks().subscribe({
      next: (data) => this.servicios.set(data),
      error: () => this.servicios.set([]),
    });
  }

  onBusqueda(event: Event): void {
    this.busqueda.set((event.target as HTMLInputElement).value);
  }

  getIconBg(tramite: QuickLink): string {
    if (tramite.badge_color === 'primary') {
      return 'bg-primary-container text-on-primary group-hover:bg-primary group-hover:text-on-primary transition-colors';
    }
    return 'bg-surface-container-high text-secondary group-hover:bg-secondary group-hover:text-on-secondary transition-colors';
  }

  getBadgeClass(tramite: QuickLink): string {
    switch (tramite.badge_color) {
      case 'primary':
        return 'bg-primary text-on-primary';
      case 'surface':
        return 'bg-surface-container text-on-surface-variant';
      case 'secondary':
      default:
        return 'bg-surface-container-low text-secondary';
    }
  }
}
