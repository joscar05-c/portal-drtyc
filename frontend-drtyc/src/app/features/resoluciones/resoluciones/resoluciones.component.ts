import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { PortalService } from '../../../core/services/portal.service';
import { DocumentItem } from '../../../core/interfaces/document.model';

@Component({
  selector: 'app-resoluciones',
  standalone: true,
  imports: [FormsModule, DatePipe],
  templateUrl: './resoluciones.component.html',
})
export class ResolucionesComponent implements OnInit {
  private portalService = inject(PortalService);

  resoluciones = signal<DocumentItem[]>([]);
  cargando = signal(true);
  terminoBusqueda = signal('');
  anioSeleccionado = signal<number | null>(null);

  anios = computed(() => {
    const aniosUnicos = [...new Set(this.resoluciones().map(r => r.year))];
    return aniosUnicos.sort((a, b) => b - a);
  });

  resolucionesFiltradas = computed(() => {
    let resultado = this.resoluciones();
    const busqueda = this.terminoBusqueda().toLowerCase().trim();
    const anio = this.anioSeleccionado();

    if (anio) {
      resultado = resultado.filter(r => r.year === anio);
    }

    if (busqueda) {
      resultado = resultado.filter(r =>
        r.document_number.toLowerCase().includes(busqueda) ||
        r.title.toLowerCase().includes(busqueda)
      );
    }

    return resultado;
  });

  ngOnInit(): void {
    this.portalService.getDocuments().subscribe({
      next: (res) => {
        this.resoluciones.set(res.data);
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
    window.open('http://127.0.0.1:8000/storage/' + url, '_blank');
  }
}
