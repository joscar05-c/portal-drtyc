import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PortalService } from '../../core/services/portal.service';
import { JobCall, ApplicationStatusResult } from '../../core/interfaces/job-call.model';

@Component({
  selector: 'app-convocatoria-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="max-w-7xl mx-auto px-gutter py-space-xl">

      <!-- Loading -->
      @if (cargando()) {
        <div class="space-y-space-md animate-pulse">
          <div class="h-8 bg-surface-container-high rounded w-2/3"></div>
          <div class="h-4 bg-surface-container-high rounded w-1/3"></div>
          <div class="h-40 bg-surface-container-high rounded"></div>
        </div>

      <!-- Error -->
      } @else if (error()) {
        <div class="p-space-xl text-center bg-surface-container-lowest rounded-xl shadow-md">
          <span class="material-symbols-outlined text-[48px] text-error mb-space-md block">error</span>
          <p class="text-headline-sm text-on-surface font-bold mb-1">{{ error() }}</p>
          <a routerLink="/convocatorias" class="inline-flex items-center gap-1 text-label-lg text-secondary hover:underline font-bold mt-space-md">
            <span class="material-symbols-outlined text-[18px]">arrow_back</span>
            Volver a Convocatorias
          </a>
        </div>

      <!-- Detalle -->
      } @else if (convocatoria()) {
        <a routerLink="/convocatorias" class="inline-flex items-center gap-1 text-label-sm text-secondary hover:underline font-bold mb-space-md">
          <span class="material-symbols-outlined text-[16px]">arrow_back</span>
          Volver a Convocatorias
        </a>

        <!-- Encabezado -->
        <div class="mb-space-lg">
          <div class="flex items-start gap-space-sm flex-wrap mb-space-sm">
            <h1 class="text-headline-lg text-primary font-bold">{{ convocatoria()!.title }}</h1>
            <span class="px-space-sm py-0.5 rounded text-label-sm font-bold whitespace-nowrap"
                  [class]="getTipoClase(convocatoria()!.type)">
              {{ convocatoria()!.type }}
            </span>
            <span class="px-space-sm py-0.5 rounded text-label-sm font-bold whitespace-nowrap"
                  [class]="getEstadoClase(convocatoria()!.status)">
              {{ convocatoria()!.status }}
            </span>
          </div>
          <div class="flex flex-wrap gap-space-md text-label-sm text-on-surface-variant">
            <span class="flex items-center gap-1">
              <span class="material-symbols-outlined text-[16px]">calendar_today</span>
              Postulaciones: {{ convocatoria()!.start_date | date:'dd/MM/yyyy' }} - {{ convocatoria()!.end_date | date:'dd/MM/yyyy' }}
            </span>
            @if (convocatoria()!.application_start_at) {
              <span class="flex items-center gap-1">
                <span class="material-symbols-outlined text-[16px]">schedule</span>
                Recepci&#243;n de CVs: {{ convocatoria()!.application_start_at | date:'dd/MM/yyyy HH:mm' }} - {{ convocatoria()!.application_end_at | date:'dd/MM/yyyy HH:mm' }}
              </span>
            }
          </div>
        </div>

        <!-- Descripción -->
        @if (convocatoria()!.description) {
          <div class="mb-space-lg p-space-lg bg-surface-container-lowest rounded-xl shadow-sm">
            <h2 class="text-headline-sm text-primary font-bold mb-space-sm">Descripci&#243;n</h2>
            <p class="text-body-md text-on-surface-variant whitespace-pre-line">{{ convocatoria()!.description }}</p>
          </div>
        }

        <!-- Cronograma -->
        @if (convocatoria()!.schedule && convocatoria()!.schedule!.length > 0) {
          <div class="mb-space-lg p-space-lg bg-surface-container-lowest rounded-xl shadow-sm">
            <h2 class="text-headline-sm text-primary font-bold mb-space-sm">Cronograma</h2>
            <ul class="flex flex-col gap-2">
              @for (etapa of convocatoria()!.schedule; track $index) {
                <li class="text-body-sm text-on-surface flex items-start gap-2">
                  <span class="material-symbols-outlined text-[16px] text-secondary mt-0.5">check_circle</span>
                  <span><strong class="font-semibold">{{ etapa.stage }}:</strong> {{ etapa.date_range }}</span>
                </li>
              }
            </ul>
          </div>
        }

        <!-- Documentos -->
        @if (convocatoria()!.documents && convocatoria()!.documents!.length > 0) {
          <div class="mb-space-lg p-space-lg bg-surface-container-lowest rounded-xl shadow-sm">
            <h2 class="text-headline-sm text-primary font-bold mb-space-sm">Documentos</h2>
            <div class="flex flex-wrap gap-space-sm">
              @for (doc of convocatoria()!.documents; track doc.file_path) {
                <button (click)="descargarDoc(doc.file_path)"
                        class="inline-flex items-center gap-1 px-space-md py-2 text-label-sm font-semibold rounded-lg bg-primary text-on-primary hover:bg-primary-container transition-colors shadow-sm cursor-pointer">
                  <span class="material-symbols-outlined text-[16px]">picture_as_pdf</span>
                  {{ doc.document_name }}
                </button>
              }
            </div>
          </div>
        }

        <!-- Consulta de Estado -->
        <div class="mb-space-lg p-space-lg bg-surface-container-lowest rounded-xl shadow-sm border border-secondary/20">
          <h2 class="text-headline-sm text-primary font-bold mb-space-xs flex items-center gap-space-xs">
            <span class="material-symbols-outlined text-[20px]">manage_search</span>
            Consultar Estado de mi Postulaci&#243;n
          </h2>
          <p class="text-body-sm text-on-surface-variant mb-space-md">Ingrese su n&#250;mero de documento para conocer el estado de su expediente.</p>

          <form (ngSubmit)="consultarEstado()" class="flex flex-col sm:flex-row gap-space-sm">
            <input class="flex-1 h-11 px-space-md rounded bg-surface-container-low text-on-surface text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                   placeholder="Ingrese su DNI o CE" type="text"
                   [(ngModel)]="dniConsulta" name="dni" required>
            <button type="submit"
                    [disabled]="consultando() || !dniConsulta"
                    class="h-11 px-space-lg rounded bg-secondary text-on-secondary font-label-lg font-bold flex items-center justify-center gap-space-xs shadow-sm transition-all disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed whitespace-nowrap">
              @if (consultando()) {
                <span class="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                <span>Buscando...</span>
              } @else {
                <span class="material-symbols-outlined text-[18px]">search</span>
                <span>Consultar</span>
              }
            </button>
          </form>

          <!-- Resultado -->
          @if (resultadoConsulta()) {
            <div class="mt-space-md p-space-md rounded-lg"
                 [class]="resultadoConsulta()!.found ? 'bg-secondary/5 border border-secondary/20' : 'bg-error/5 border border-error/20'">
              @if (resultadoConsulta()!.found) {
                <div class="flex items-center justify-between">
                  <div>
                    <span class="text-label-sm text-outline block">Estado de su postulaci&#243;n</span>
                    <span class="text-headline-sm font-bold"
                          [class]="getEstadoTextoClase(resultadoConsulta()!.status!)">
                      {{ resultadoConsulta()!.status }}
                    </span>
                  </div>
                  <span class="text-label-sm text-outline">
                    Actualizado: {{ resultadoConsulta()!.updated_at }}
                  </span>
                </div>
              } @else {
                <div class="flex items-center gap-space-sm">
                  <span class="material-symbols-outlined text-[20px] text-error">info</span>
                  <span class="text-body-sm text-on-surface">{{ resultadoConsulta()!.message }}</span>
                </div>
              }
            </div>
          }
        </div>

      }
    </div>
  `,
})
export class ConvocatoriaDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private portalService = inject(PortalService);

  convocatoria = signal<JobCall | null>(null);
  cargando = signal(true);
  error = signal('');

  dniConsulta = '';
  consultando = signal(false);
  resultadoConsulta = signal<ApplicationStatusResult | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error.set('Convocatoria no encontrada.');
      this.cargando.set(false);
      return;
    }

    this.portalService.getJobCallById(+id).subscribe({
      next: (data) => {
        this.convocatoria.set(data);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('Convocatoria no encontrada.');
        this.cargando.set(false);
      }
    });
  }

  consultarEstado(): void {
    if (!this.dniConsulta || !this.convocatoria()) return;

    this.consultando.set(true);
    this.resultadoConsulta.set(null);

    this.portalService.checkApplicationStatus(this.convocatoria()!.id, this.dniConsulta).subscribe({
      next: (res) => {
        this.resultadoConsulta.set(res);
        this.consultando.set(false);
      },
      error: (err) => {
        this.resultadoConsulta.set(err.error);
        this.consultando.set(false);
      }
    });
  }

  descargarDoc(path: string): void {
    const apiUrl = 'http://127.0.0.1:8000';
    window.open(`${apiUrl}/storage/${path}`, '_blank');
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

  getEstadoTextoClase(status: string): string {
    switch (status) {
      case 'Recibido': return 'text-info';
      case 'Apto': return 'text-secondary';
      case 'No Apto': return 'text-error';
      default: return 'text-on-surface';
    }
  }
}
