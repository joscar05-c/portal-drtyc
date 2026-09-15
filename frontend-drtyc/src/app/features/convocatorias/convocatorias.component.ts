import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { PortalService } from '../../core/services/portal.service';
import { Convocatoria } from '../../core/interfaces/convocatoria.model';

@Component({
  selector: 'app-convocatorias',
  standalone: true,
  templateUrl: './convocatorias.component.html',
})
export class ConvocatoriasComponent implements OnInit {
  private portalService = inject(PortalService);

  convocatorias = signal<Convocatoria[]>([]);
  cargando = signal(true);
  filtroEstado = signal<'Todas' | 'Vigente' | 'Finalizada'>('Todas');

  convocatoriasFiltradas = computed(() => {
    const filtro = this.filtroEstado();
    if (filtro === 'Todas') return this.convocatorias();
    return this.convocatorias().filter(c => c.estado === filtro);
  });

  totalVigentes = computed(() => this.convocatorias().filter(c => c.estado === 'Vigente').length);
  totalFinalizadas = computed(() => this.convocatorias().filter(c => c.estado === 'Finalizada').length);

  ngOnInit(): void {
    this.portalService.getConvocatorias().subscribe({
      next: (data) => {
        this.convocatorias.set(data);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false)
    });
  }

  onFiltro(estado: 'Todas' | 'Vigente' | 'Finalizada'): void {
    this.filtroEstado.set(estado);
  }

  descargarBases(url: string): void {
    window.open(url, '_blank');
  }
}
