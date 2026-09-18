import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PortalService } from '../../core/services/portal.service';
import { JobCall } from '../../core/interfaces/job-call.model';

@Component({
  selector: 'app-convocatorias-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Hero Header -->
    <section class="w-full bg-surface-container-low py-space-xl">
      <div class="max-w-7xl mx-auto px-gutter text-center">
        <div class="flex items-center justify-center gap-space-xs text-secondary text-label-md uppercase tracking-wider mb-space-sm">
          <span class="material-symbols-outlined text-[18px]">work</span>
          <span>Procesos de Selecci&#243;n</span>
        </div>
        <h1 class="text-headline-xl text-primary font-bold mb-space-sm">Oportunidades Laborales</h1>
        <p class="text-body-lg text-on-surface-variant max-w-2xl mx-auto">
          &#218;nete al equipo de la Direcci&#243;n Regional de Transportes y Comunicaciones. Encuentra convocatorias CAS, CAP, Pr&#225;cticas y m&#225;s.
        </p>
      </div>
    </section>

    <!-- Contenido -->
    <div class="max-w-7xl mx-auto px-gutter py-space-xl">

      <!-- Filtros por Tipo -->
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
          Pr&#225;cticas ({{ totalPorTipo('Prácticas') }})
        </button>
      </div>

      <!-- Loading -->
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

      <!-- Lista de Convocatorias -->
      } @else if (filtradas().length > 0) {
        <div class="space-y-space-md">
          @for (convocatoria of filtradas(); track convocatoria.id) {
            <div class="p-space-lg bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm hover:shadow-md transition-all">
              <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-space-md">
                <div class="flex-1">
                  <div class="flex items-start gap-space-sm mb-space-xs flex-wrap">
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
                  <!-- Cronograma -->
                  @if (convocatoria.schedule && convocatoria.schedule.length > 0) {
                    <div class="mt-space-md p-space-md bg-surface-container-low rounded-lg">
                      <span class="text-label-sm font-bold text-primary block mb-space-xs">Cronograma:</span>
                      <ul class="flex flex-col gap-2">
                        @for (etapa of convocatoria.schedule; track $index) {
                          <li class="text-body-sm text-on-surface flex items-start gap-1">
                            <span class="material-symbols-outlined text-[16px] text-secondary mt-0.5">check_circle</span>
                            <span><strong class="font-semibold">{{ etapa.stage }}:</strong> {{ etapa.date_range }}</span>
                          </li>
                        }
                      </ul>
                    </div>
                  }
                </div>
                <div class="flex-shrink-0 flex flex-col gap-space-sm min-w-[280px]">
                  <!-- Botón Ver Detalle -->
                  <a [routerLink]="['/convocatorias', convocatoria.slug]"
                     class="w-full inline-flex items-center justify-center gap-1 px-space-md py-2 text-label-sm font-semibold rounded-lg bg-surface-container-low text-on-surface border border-outline-variant hover:bg-surface-container transition-colors shadow-sm cursor-pointer">
                    <span class="material-symbols-outlined text-[16px]">visibility</span>
                    Ver detalle
                  </a>
                  <!-- Botones de documentos -->
                  @for (doc of convocatoria.documents; track doc.file_path) {
                    <button (click)="descargarDoc(doc.file_path)"
                            class="w-full inline-flex items-center justify-center gap-1 px-space-md py-2 text-label-sm font-semibold rounded-lg bg-surface-container-low text-on-surface border border-outline-variant hover:bg-surface-container transition-colors shadow-sm cursor-pointer">
                      <span class="material-symbols-outlined text-[16px]">picture_as_pdf</span>
                      {{ doc.document_name }}
                    </button>
                  }
                  <!-- Botón Postular -->
                  @if (convocatoria.status === 'Vigente') {
                    @if (canApply(convocatoria)) {
                      <a [routerLink]="['/convocatorias', convocatoria.slug, 'postular']"
                         class="w-full inline-flex items-center justify-center gap-1 px-space-lg py-2.5 text-label-md font-bold rounded-lg bg-secondary text-on-secondary hover:bg-secondary-container transition-colors shadow-md cursor-pointer">
                        <span class="material-symbols-outlined text-[18px]">send</span>
                        Postular a esta convocatoria
                      </a>
                    } @else if (isBeforeStart(convocatoria)) {
                      <span class="w-full inline-flex items-center justify-center gap-1 px-space-md py-2 text-label-sm font-semibold rounded-lg bg-surface-container text-on-surface-variant">
                        <span class="material-symbols-outlined text-[16px]">schedule</span>
                        A&#250;n no abren las postulaciones
                      </span>
                    } @else if (isAfterEnd(convocatoria)) {
                      <span class="w-full inline-flex items-center justify-center gap-1 px-space-md py-2 text-label-sm font-semibold rounded-lg bg-error/10 text-error">
                        <span class="material-symbols-outlined text-[16px]">block</span>
                        Plazo de postulaci&#243;n finalizado
                      </span>
                    }
                  }
                </div>
              </div>
            </div>
          }
        </div>

      <!-- Sin resultados -->
      } @else {
        <div class="p-space-xl text-center bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm">
          <span class="material-symbols-outlined text-[48px] text-outline mb-space-md block">work_off</span>
          <p class="text-headline-sm text-on-surface font-bold mb-1">No hay convocatorias disponibles</p>
          <p class="text-body-sm text-on-surface-variant">No se encontraron convocatorias para este filtro</p>
        </div>
      }
    </div>
  `,
})
export class ConvocatoriasListComponent implements OnInit {
  private portalService = inject(PortalService);

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
    const apiUrl = 'http://127.0.0.1:8000';
    window.open(`${apiUrl}/storage/${path}`, '_blank');
  }

  canApply(jobCall: JobCall): boolean {
    if (!jobCall.application_start_at || !jobCall.application_end_at) {
      return false;
    }
    const now = new Date();
    const start = new Date(jobCall.application_start_at);
    const end = new Date(jobCall.application_end_at);
    return now >= start && now <= end;
  }

  isBeforeStart(jobCall: JobCall): boolean {
    if (!jobCall.application_start_at) return false;
    return new Date() < new Date(jobCall.application_start_at);
  }

  isAfterEnd(jobCall: JobCall): boolean {
    if (!jobCall.application_end_at) return false;
    return new Date() > new Date(jobCall.application_end_at);
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
