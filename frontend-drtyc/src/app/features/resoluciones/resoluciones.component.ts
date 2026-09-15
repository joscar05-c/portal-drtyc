import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PortalService } from '../../core/services/portal.service';
import { Resolucion } from '../../core/interfaces/resolucion.model';

@Component({
  selector: 'app-resoluciones',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './resoluciones.component.html',
})
export class ResolucionesComponent implements OnInit {
  private portalService = inject(PortalService);

  resoluciones = signal<Resolucion[]>([]);
  cargando = signal(true);
  terminoBusqueda = signal('');
  anioSeleccionado = signal<number | null>(null);

  anios = computed(() => {
    const aniosUnicos = [...new Set(this.resoluciones().map(r => r.anio))];
    return aniosUnicos.sort((a, b) => b - a);
  });

  resolucionesFiltradas = computed(() => {
    let resultado = this.resoluciones();
    const busqueda = this.terminoBusqueda().toLowerCase().trim();
    const anio = this.anioSeleccionado();

    if (anio) {
      resultado = resultado.filter(r => r.anio === anio);
    }

    if (busqueda) {
      resultado = resultado.filter(r =>
        r.numero.toLowerCase().includes(busqueda) ||
        r.descripcion.toLowerCase().includes(busqueda)
      );
    }

    return resultado;
  });

  ngOnInit(): void {
    this.portalService.getResoluciones().subscribe({
      next: (data) => {
        this.resoluciones.set(data);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false)
    });
  }

  onBuscar(event: Event): void {
    const valor = (event.target as HTMLInputElement).value;
    this.terminoBusqueda.set(valor);
  }

  onFiltrarAnio(anio: number | null): void {
    this.anioSeleccionado.set(anio);
  }

  descargarPdf(url: string): void {
    window.open(url, '_blank');
  }
}
