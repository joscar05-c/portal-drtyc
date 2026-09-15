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
        path: 'transparencia',
        loadComponent: () => import('./features/inicio/inicio.component').then(m => m.InicioComponent)
      }
    ]
  }
];
