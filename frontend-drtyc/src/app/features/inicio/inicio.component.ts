import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PortalService } from '../../core/services/portal.service';
import { Noticia } from '../../core/interfaces/noticia.model';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './inicio.component.html',
})
export class InicioComponent implements OnInit {
  private portalService = inject(PortalService);

  noticias = signal<Noticia[]>([]);
  cargando = signal(true);

  accesosRapidos = [
    {
      titulo: 'Consulta de Licencias',
      descripcion: 'Verifica el estado y vigencia de tu licencia de conducir',
      icono: 'M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0',
      ruta: '/tramites/licencias',
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      titulo: 'Papeletas',
      descripcion: 'Consulta y paga tus papeletas de tránsito en línea',
      icono: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      ruta: '/tramites/papeletas',
      color: 'bg-emerald-600 hover:bg-emerald-700'
    },
    {
      titulo: 'Trámites en Línea',
      descripcion: 'Realiza tus trámites administrativos de forma digital',
      icono: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z',
      ruta: '/tramites',
      color: 'bg-amber-600 hover:bg-amber-700'
    },
    {
      titulo: 'Directorio',
      descripcion: 'Encuentra los números de contacto de las oficinas regionales',
      icono: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z',
      ruta: '/directorio',
      color: 'bg-purple-600 hover:bg-purple-700'
    }
  ];

  ngOnInit(): void {
    this.portalService.getNoticiasRecientes(3).subscribe({
      next: (data) => {
        this.noticias.set(data);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false)
    });
  }
}
