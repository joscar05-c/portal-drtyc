import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { DatePipe } from '@angular/common';
import { PortalService } from '../../core/services/portal.service';
import { JobPosting } from '../../core/interfaces/job-posting.model';

@Component({
  selector: 'app-convocatorias',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './convocatorias.component.html',
})
export class ConvocatoriasComponent implements OnInit {
  private portalService = inject(PortalService);

  convocatorias = signal<JobPosting[]>([]);
  cargando = signal(true);
  filtroEstado = signal<'Todas' | 'vigente' | 'evaluacion' | 'finalizada'>('Todas');

  convocatoriasFiltradas = computed(() => {
    const filtro = this.filtroEstado();
    if (filtro === 'Todas') return this.convocatorias();
    return this.convocatorias().filter(c => c.status === filtro);
  });

  totalVigentes = computed(() => this.convocatorias().filter(c => c.status === 'vigente').length);
  totalFinalizadas = computed(() => this.convocatorias().filter(c => c.status === 'finalizada').length);

  ngOnInit(): void {
    this.portalService.getJobPostings().subscribe({
      next: (data) => {
        this.convocatorias.set(data);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false)
    });
  }

  onFiltro(estado: 'Todas' | 'vigente' | 'evaluacion' | 'finalizada'): void {
    this.filtroEstado.set(estado);
  }

  descargarBases(url: string): void {
    window.open('http://127.0.0.1:8000/storage/' + url, '_blank');
  }

  estadoLabel(estado: string): string {
    const labels: Record<string, string> = {
      'vigente': 'Vigente',
      'evaluacion': 'En Evaluación',
      'finalizada': 'Finalizada'
    };
    return labels[estado] || estado;
  }
}
