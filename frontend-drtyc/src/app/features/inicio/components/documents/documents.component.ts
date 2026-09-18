import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { PortalService } from '../../../../core/services/portal.service';
import { DocumentItem } from '../../../../core/interfaces/document.model';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [FormsModule, DatePipe],
  templateUrl: './documents.component.html',
})
export class DocumentsComponent implements OnInit {
  private portalService = inject(PortalService);
  documentos = signal<DocumentItem[]>([]);
  cargando = signal(true);
  busqueda = signal('');
  anioSeleccionado = signal<number | null>(null);
  tipoSeleccionado = signal<string | null>(null);
  private apiUrl = environment.apiUrl.replace('/api/v1', '');

  anios = computed(() => {
    const u = [...new Set(this.documentos().map(d => d.year))];
    return u.sort((a, b) => b - a);
  });

  documentosFiltrados = computed(() => {
    let result = this.documentos();
    if (this.anioSeleccionado()) result = result.filter(d => d.year === this.anioSeleccionado());
    if (this.tipoSeleccionado()) result = result.filter(d => d.document_type === this.tipoSeleccionado());
    const q = this.busqueda().toLowerCase();
    if (q) {
      result = result.filter(d =>
        d.document_number.toLowerCase().includes(q) || d.title.toLowerCase().includes(q)
      );
    }
    return result;
  });

  ngOnInit(): void {
    this.portalService.getDocuments().subscribe({
      next: (res) => { this.documentos.set(res.data); this.cargando.set(false); },
      error: () => this.cargando.set(false),
    });
  }

  onBusqueda(event: Event): void { this.busqueda.set((event.target as HTMLInputElement).value); }
  onFiltrarAnio(anio: number | null): void { this.anioSeleccionado.set(anio); }
  onFiltrarTipo(tipo: string | null): void { this.tipoSeleccionado.set(tipo); }

  descargar(path: string): void {
    window.open(`${this.apiUrl}/storage/${path}`, '_blank');
  }
}
