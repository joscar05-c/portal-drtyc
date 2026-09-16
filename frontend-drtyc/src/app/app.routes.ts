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
        loadComponent: () => import('./features/convocatorias/convocatorias.component').then(m => m.ConvocatoriasComponent)
      },
      {
        path: 'noticias/:slug',
        loadComponent: () => import('./features/inicio/inicio.component').then(m => m.InicioComponent)
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
      }
    ]
  }
];
