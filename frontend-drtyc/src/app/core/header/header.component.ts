import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  private router = inject(Router);

  menuAbierto = signal(false);

  navItems = [
    { route: '/', label: 'Inicio' },
    { route: '/institucional', label: 'Institucional' },
    { route: '/tramites', label: 'Servicios y Tr\u00e1mites' },
    { route: '/resoluciones', label: 'Normativa y Resoluciones' },
    { route: '/obras-viales', label: 'Obras y Proyectos Viales' },
    { route: '/noticias', label: 'Noticias y Comunicados' },
    { route: '/convocatorias', label: 'Oportunidad Laboral' },
  ];

  isExact(route: string): boolean {
    return this.router.url === route;
  }

  isActive(route: string): boolean {
    return this.router.url.startsWith(route);
  }
}
