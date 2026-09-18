import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { PortalService } from '../../../../core/services/portal.service';
import { QuickLink } from '../../../../core/interfaces/quick-link.model';

@Component({
  selector: 'app-services',
  standalone: true,
  templateUrl: './services.component.html',
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
