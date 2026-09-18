import { Component, OnInit, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { PortalService } from '../../../../core/services/portal.service';
import { Project } from '../../../../core/interfaces/project.model';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './projects.component.html',
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
