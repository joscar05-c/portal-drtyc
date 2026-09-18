import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PortalService } from '../../../core/services/portal.service';
import { JobCall } from '../../../core/interfaces/job-call.model';

@Component({
  selector: 'app-convocatorias-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './convocatorias-list.component.html',
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
