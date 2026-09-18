import { Routes } from '@angular/router';
import { LayoutComponent } from './core/layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./features/inicio/inicio.component').then(m => m.InicioComponent)
      },
      {
        path: 'resoluciones',
        loadComponent: () => import('./features/resoluciones/resoluciones.component').then(m => m.ResolucionesComponent)
      },
      {
        path: 'convocatorias',
        loadComponent: () => import('./features/convocatorias/convocatorias-list.component').then(m => m.ConvocatoriasListComponent)
      },
      {
        path: 'convocatorias/:slug',
        loadComponent: () => import('./features/convocatorias/convocatoria-detail.component').then(m => m.ConvocatoriaDetailComponent)
      },
      {
        path: 'convocatorias/:slug/postular',
        loadComponent: () => import('./features/convocatorias/postulate.component').then(m => m.PostulateComponent)
      },
      {
        path: 'noticias',
        loadComponent: () => import('./features/noticias/noticias.component').then(m => m.NoticiasComponent)
      },
      {
        path: 'noticias/:slug',
        loadComponent: () => import('./features/noticias/noticia-detalle.component').then(m => m.NoticiaDetalleComponent)
      },
      {
        path: 'directorio',
        loadComponent: () => import('./features/inicio/inicio.component').then(m => m.InicioComponent)
      },
      {
        path: 'preguntas-frecuentes',
        loadComponent: () => import('./features/inicio/inicio.component').then(m => m.InicioComponent)
      },
      {
        path: 'obras-viales',
        loadComponent: () => import('./features/inicio/inicio.component').then(m => m.InicioComponent)
      },
      {
        path: 'reclamos',
        loadComponent: () => import('./features/inicio/inicio.component').then(m => m.InicioComponent)
      },
      {
        path: 'seguimiento-reclamos',
        loadComponent: () => import('./features/complaint/complaint-track.component').then(m => m.ComplaintTrackComponent)
      }
    ]
  }
];
