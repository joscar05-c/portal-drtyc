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
        path: 'institucional',
        loadComponent: () => import('./features/institucional/institucional/institucional.component').then(m => m.InstitucionalComponent)
      },
      {
        path: 'tramites',
        loadComponent: () => import('./features/servicios/servicios/servicios.component').then(m => m.ServiciosComponent)
      },
      {
        path: 'resoluciones',
        loadComponent: () => import('./features/resoluciones/resoluciones/resoluciones.component').then(m => m.ResolucionesComponent)
      },
      {
        path: 'obras-viales',
        loadComponent: () => import('./features/obras/obras/obras.component').then(m => m.ObrasComponent)
      },
      {
        path: 'noticias',
        loadComponent: () => import('./features/noticias/noticias/noticias.component').then(m => m.NoticiasComponent)
      },
      {
        path: 'noticias/:slug',
        loadComponent: () => import('./features/noticias/noticia-detalle/noticia-detalle.component').then(m => m.NoticiaDetalleComponent)
      },
      {
        path: 'convocatorias',
        loadComponent: () => import('./features/convocatorias/convocatorias-list/convocatorias-list.component').then(m => m.ConvocatoriasListComponent)
      },
      {
        path: 'convocatorias/:slug',
        loadComponent: () => import('./features/convocatorias/convocatoria-detail/convocatoria-detail.component').then(m => m.ConvocatoriaDetailComponent)
      },
      {
        path: 'convocatorias/:slug/postular',
        loadComponent: () => import('./features/convocatorias/postulate/postulate.component').then(m => m.PostulateComponent)
      },
      {
        path: 'seguimiento-reclamos',
        loadComponent: () => import('./features/complaint/complaint-track/complaint-track.component').then(m => m.ComplaintTrackComponent)
      },
      {
        path: 'mesa-de-partes',
        loadComponent: () => import('./features/mesa-partes/mesa-partes/mesa-partes.component').then(m => m.MesaPartesComponent)
      },
      {
        path: 'mesa-de-partes/seguimiento',
        loadComponent: () => import('./features/mesa-partes/seguimiento/seguimiento.component').then(m => m.SeguimientoComponent)
      }
    ]
  }
];
