import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PortalService } from '../../../core/services/portal.service';
import { JobCall, ApplicationStatusResult } from '../../../core/interfaces/job-call.model';

@Component({
  selector: 'app-convocatoria-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './convocatoria-detail.component.html',
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
    const slug = this.route.snapshot.paramMap.get('slug');
    if (!slug) {
      this.error.set('Convocatoria no encontrada.');
      this.cargando.set(false);
      return;
    }

    this.portalService.getJobCallBySlug(slug).subscribe({
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
