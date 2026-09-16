import { Component, OnInit, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { PortalService } from '../../../core/services/portal.service';
import { Project } from '../../../core/interfaces/project.model';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CurrencyPipe],
  template: `
    <section class="w-full mb-space-xl">
      <div class="flex flex-col md:flex-row md:items-end justify-between mb-space-lg gap-space-md">
        <div>
          <div class="flex items-center gap-space-xs text-secondary text-label-md uppercase tracking-wider mb-1">
            <span class="material-symbols-outlined text-[18px]">engineering</span>
            <span>Inversión Regional y Conectividad</span>
          </div>
          <h2 class="text-headline-lg text-primary font-bold">Obras y Proyectos Viales Estratégicos</h2>
        </div>
      </div>

      @if (cargando()) {
        <div class="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
          @for (i of [1, 2, 3]; track i) {
            <div class="bg-surface-container-lowest rounded-xl shadow-sm animate-pulse">
              <div class="h-48 bg-surface-container-high rounded-t-xl"></div>
              <div class="p-space-lg space-y-3">
                <div class="h-4 bg-surface-container-high rounded w-3/4"></div>
                <div class="h-3 bg-surface-container-high rounded w-full"></div>
                <div class="h-3 bg-surface-container-high rounded w-2/3"></div>
              </div>
            </div>
          }
        </div>
      } @else if (proyectos().length > 0) {
        <div class="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
          @for (proyecto of proyectos(); track proyecto.id) {
            <div class="bg-surface-container-lowest rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between">
              @if (proyecto.image_path) {
                <div class="relative h-48 w-full overflow-hidden">
                  <img class="w-full h-full object-cover" [src]="getImageUrl(proyecto.image_path)" [alt]="proyecto.title">
                  <div class="absolute top-space-sm right-space-sm">
                    <span class="px-space-sm py-1 rounded text-label-sm font-bold shadow-sm"
                          [class]="getStatusClass(proyecto.status)">
                      {{ getStatusLabel(proyecto.status) }}
                    </span>
                  </div>
                </div>
              } @else {
                <div class="relative h-48 w-full bg-surface-container flex items-center justify-center">
                  <span class="material-symbols-outlined text-[48px] text-outline">construction</span>
                  <div class="absolute top-space-sm right-space-sm">
                    <span class="px-space-sm py-1 rounded text-label-sm font-bold shadow-sm"
                          [class]="getStatusClass(proyecto.status)">
                      {{ getStatusLabel(proyecto.status) }}
                    </span>
                  </div>
                </div>
              }
              <div class="p-space-lg flex-1 flex flex-col justify-between">
                <div>
                  <h3 class="text-headline-sm text-primary font-bold mb-space-xs">{{ proyecto.title }}</h3>
                  <p class="text-body-sm text-on-surface-variant mb-space-md">{{ proyecto.location }}</p>

                  <!-- Barra de Avance -->
                  <div class="bg-surface-container-low p-space-md rounded-lg mb-space-md">
                    <div class="flex justify-between items-center mb-1.5 text-label-sm">
                      <span class="font-semibold text-on-surface">Avance Físico Acumulado</span>
                      <span class="font-bold text-secondary">{{ proyecto.progress_percentage }}%</span>
                    </div>
                    <div class="w-full bg-surface-container-high rounded-full h-2.5 overflow-hidden">
                      <div class="bg-secondary h-2.5 rounded-full transition-all duration-1000"
                           [style.width.%]="proyecto.progress_percentage"></div>
                    </div>
                  </div>

                  <!-- Datos Técnicos -->
                  <ul class="space-y-1 text-label-sm text-on-surface-variant mb-space-md">
                    <li class="flex justify-between">
                      <span>Monto de Inversión:</span>
                      <strong class="text-on-surface font-semibold">{{ proyecto.budget | currency:'S/':'symbol':'1.0-0' }}</strong>
                    </li>
                    <li class="flex justify-between">
                      <span>Ubicación:</span>
                      <span class="text-on-surface">{{ proyecto.location }}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          }
        </div>
      } @else {
        <div class="p-12 text-center bg-surface-container-lowest rounded-lg shadow-sm">
          <span class="material-symbols-outlined text-[48px] text-outline mb-space-md block">engineering</span>
          <p class="text-headline-sm text-on-surface font-bold mb-1">No hay proyectos registrados</p>
          <p class="text-body-sm text-on-surface-variant">Próximamente se publicarán los avances de obras</p>
        </div>
      }
    </section>
  `,
})
export class ProjectsComponent implements OnInit {
  private portalService = inject(PortalService);
  proyectos = signal<Project[]>([]);
  cargando = signal(true);
  private apiUrl = environment.apiUrl.replace('/api/v1', '');

  ngOnInit(): void {
    this.portalService.getProjects().subscribe({
      next: (data) => { this.proyectos.set(data); this.cargando.set(false); },
      error: () => this.cargando.set(false),
    });
  }

  getImageUrl(path: string): string {
    return `${this.apiUrl}/storage/${path}`;
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      planeamiento: 'En Planeamiento',
      en_ejecucion: 'En Ejecución',
      paralizada: 'Paralizada',
      culminada: 'Culminada',
    };
    return labels[status] || status;
  }

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      planeamiento: 'bg-surface-container text-on-surface-variant',
      en_ejecucion: 'bg-secondary text-on-secondary',
      paralizada: 'bg-error-container text-on-error-container',
      culminada: 'bg-primary text-on-primary',
    };
    return classes[status] || 'bg-surface-container text-on-surface-variant';
  }
}
