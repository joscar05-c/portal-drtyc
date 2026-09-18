import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PortalService } from '../../core/services/portal.service';
import { JobCall } from '../../core/interfaces/job-call.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-job-calls',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="max-w-7xl mx-auto px-gutter py-space-xl">
      <section class="w-full">

        <div class="mb-space-xl">
          <div class="flex items-center gap-space-xs text-secondary text-label-md uppercase tracking-wider mb-1">
            <span class="material-symbols-outlined text-[18px]">work</span>
            <span>Procesos de Selección</span>
          </div>
          <h1 class="text-headline-xl text-primary font-bold mb-space-sm">Convocatorias de Trabajo</h1>
          <p class="text-body-lg text-on-surface-variant">CAS, CAP, Prácticas y otros procesos de selección vigentes.</p>
        </div>

        <div class="flex flex-wrap gap-space-sm mb-space-lg">
          <button (click)="onFiltro('Todas')"
                  class="px-space-md py-2 text-label-md font-semibold rounded-lg transition-all cursor-pointer"
                  [class]="filtroTipo() === 'Todas'
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'">
            Todas ({{ jobCalls().length }})
          </button>
          <button (click)="onFiltro('CAS')"
                  class="px-space-md py-2 text-label-md font-semibold rounded-lg transition-all cursor-pointer"
                  [class]="filtroTipo() === 'CAS'
                    ? 'bg-secondary text-on-secondary shadow-sm'
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'">
            CAS ({{ totalPorTipo('CAS') }})
          </button>
          <button (click)="onFiltro('CAP')"
                  class="px-space-md py-2 text-label-md font-semibold rounded-lg transition-all cursor-pointer"
                  [class]="filtroTipo() === 'CAP'
                    ? 'bg-secondary text-on-secondary shadow-sm'
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'">
            CAP ({{ totalPorTipo('CAP') }})
          </button>
          <button (click)="onFiltro('Prácticas')"
                  class="px-space-md py-2 text-label-md font-semibold rounded-lg transition-all cursor-pointer"
                  [class]="filtroTipo() === 'Prácticas'
                    ? 'bg-secondary text-on-secondary shadow-sm'
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'">
            Prácticas ({{ totalPorTipo('Prácticas') }})
          </button>
        </div>

        @if (cargando()) {
          <div class="space-y-space-md">
            @for (i of [1, 2, 3]; track i) {
              <div class="p-space-lg bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm animate-pulse">
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="h-5 bg-surface-container-high rounded w-3/4 mb-space-sm"></div>
                    <div class="h-4 bg-surface-container-high rounded w-1/4 mb-space-xs"></div>
                    <div class="h-4 bg-surface-container-high rounded w-1/3"></div>
                  </div>
                  <div class="h-8 bg-surface-container-high rounded w-24"></div>
                </div>
              </div>
            }
          </div>
        } @else if (filtradas().length > 0) {
          <div class="space-y-space-md">
            @for (convocatoria of filtradas(); track convocatoria.id) {
              <div class="p-space-lg bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm hover:shadow-md transition-all">
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-space-md">
                  <div class="flex-1">
                    <div class="flex items-start gap-space-sm mb-space-xs">
                      <h3 class="text-headline-sm text-on-surface font-bold">{{ convocatoria.title }}</h3>
                      <span class="px-space-sm py-0.5 rounded text-label-sm font-bold whitespace-nowrap"
                            [class]="getTipoClase(convocatoria.type)">
                        {{ convocatoria.type }}
                      </span>
                      <span class="px-space-sm py-0.5 rounded text-label-sm font-bold whitespace-nowrap"
                            [class]="getEstadoClase(convocatoria.status)">
                        {{ convocatoria.status }}
                      </span>
                    </div>
                    <div class="flex flex-wrap gap-space-md text-label-sm text-on-surface-variant">
                      <span class="flex items-center gap-1">
                        <span class="material-symbols-outlined text-[16px]">calendar_today</span>
                        Inicio: {{ convocatoria.start_date | date:'dd/MM/yyyy' }}
                      </span>
                      <span class="flex items-center gap-1">
                        <span class="material-symbols-outlined text-[16px]">event_busy</span>
                        Fin: {{ convocatoria.end_date | date:'dd/MM/yyyy' }}
                      </span>
                      @if (convocatoria.documents && convocatoria.documents.length > 0) {
                        <span class="flex items-center gap-1">
                          <span class="material-symbols-outlined text-[16px]">attach_file</span>
                          {{ convocatoria.documents.length }} documento(s)
                        </span>
                      }
                    </div>
                    @if (convocatoria.description) {
                      <p class="text-body-sm text-on-surface-variant mt-space-sm line-clamp-2">{{ convocatoria.description }}</p>
                    }
                  </div>
                  <div class="flex-shrink-0 flex gap-space-sm">
                    @if (convocatoria.documents && convocatoria.documents.length > 0) {
                      @for (doc of convocatoria.documents; track doc.file_path) {
                        <button (click)="descargarDoc(doc.file_path)"
                                class="inline-flex items-center gap-1 px-space-md py-2 text-label-sm font-semibold rounded-lg bg-primary text-on-primary hover:bg-primary-container transition-colors shadow-sm cursor-pointer">
                          <span class="material-symbols-outlined text-[16px]">picture_as_pdf</span>
                          {{ doc.document_name }}
                        </button>
                      }
                    }
                  </div>
                </div>
              </div>
            }
          </div>
        } @else {
          <div class="p-space-xl text-center bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm">
            <span class="material-symbols-outlined text-[48px] text-outline mb-space-md block">work_off</span>
            <p class="text-headline-sm text-on-surface font-bold mb-1">No hay convocatorias disponibles</p>
            <p class="text-body-sm text-on-surface-variant">No se encontraron convocatorias para este filtro</p>
          </div>
        }

      </section>
    </div>
  `,
})
export class JobCallsComponent implements OnInit {
  private portalService = inject(PortalService);
  private apiUrl = environment.apiUrl.replace('/api/v1', '');

  jobCalls = signal<JobCall[]>([]);
  cargando = signal(true);
  filtroTipo = signal<string>('Todas');

  filtradas = computed(() => {
    const filtro = this.filtroTipo();
    if (filtro === 'Todas') return this.jobCalls();
    return this.jobCalls().filter(c => c.type === filtro);
  });

  ngOnInit(): void {
    this.portalService.getJobCalls().subscribe({
      next: (data) => {
        this.jobCalls.set(data);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false)
    });
  }

  onFiltro(tipo: string): void {
    this.filtroTipo.set(tipo);
  }

  totalPorTipo(tipo: string): number {
    return this.jobCalls().filter(c => c.type === tipo).length;
  }

  descargarDoc(path: string): void {
    window.open(`${this.apiUrl}/storage/${path}`, '_blank');
  }

  getTipoClase(type: string): string {
    switch (type) {
      case 'CAS': return 'bg-info/15 text-info';
      case 'CAP': return 'bg-warning/15 text-warning';
      case 'Prácticas': return 'bg-success/15 text-success';
      default: return 'bg-surface-container text-on-surface-variant';
    }
  }

  getEstadoClase(status: string): string {
    switch (status) {
      case 'Vigente': return 'bg-secondary/15 text-secondary';
      case 'En Evaluación': return 'bg-tertiary-fixed text-on-tertiary-container';
      case 'Concluida': return 'bg-surface-container text-on-surface-variant';
      case 'Cancelada': return 'bg-error/15 text-error';
      default: return 'bg-surface-container text-on-surface-variant';
    }
  }
}
