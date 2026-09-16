import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header
      class="fixed top-0 left-0 w-full z-50 bg-surface-container-lowest/95 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.06)]"
    >
      <!-- Top Bar -->
      <div class="bg-primary text-on-primary">
        <div class="max-w-7xl mx-auto px-gutter flex items-center justify-between h-9">
          <div class="flex items-center gap-space-md">
            <span
              class="font-label-sm text-label-sm text-surface-variant flex items-center gap-space-xs"
              ><span class="material-symbols-outlined text-[15px]">account_balance</span>Gobierno
              Regional • Estado Peruano</span
            ><a
              class="hidden sm:inline-block font-label-sm text-label-sm text-surface-variant hover:text-on-primary underline-offset-2 hover:underline transition-colors"
              href="#"
              >Plataforma Digital del Estado Peruano</a
            >
          </div>
          <div class="flex items-center gap-space-md">
            <div class="flex items-center gap-space-xs">
              <button
                class="h-6 px-space-xs text-on-primary hover:bg-primary-container rounded flex items-center justify-center font-label-sm text-label-sm"
                title="Aumentar tamaño del texto"
                type="button"
              >
                A+</button
              ><button
                class="h-6 px-space-xs text-on-primary hover:bg-primary-container rounded flex items-center justify-center font-label-sm text-label-sm"
                title="Contraste accesible"
                type="button"
              >
                <span class="material-symbols-outlined text-[15px]">contrast</span>
              </button>
            </div>
            <a
              class="bg-secondary hover:bg-on-secondary-fixed-variant text-on-secondary px-space-sm py-0.5 rounded font-label-sm text-label-sm tracking-wide transition-colors flex items-center gap-space-xs"
              href="#"
              ><span class="material-symbols-outlined text-[14px]">visibility</span>Portal de
              Transparencia Estándar</a
            >
          </div>
        </div>
      </div>

      <!-- Middle Bar: Logo, Search, Actions -->
      <div class="max-w-7xl mx-auto px-gutter h-20 flex items-center justify-between gap-space-lg">
        <div class="flex items-center gap-space-md min-w-max">
          <img
            alt="Logotipo DRTC Institucional"
            class="h-8 w-auto object-contain"
            src="/img/LOGO DRTC-2026.png"
          />
          <div class="flex flex-col">
            <span
              class="font-headline-sm text-headline-sm text-primary tracking-tight leading-tight"
              >DRTC</span
            ><span class="font-label-sm text-label-sm text-on-surface-variant leading-none"
              >Dirección Regional de Transportes y Comunicaciones</span
            >
          </div>
        </div>
        <div class="hidden lg:flex flex-1 max-w-xl items-center">
          <form class="w-full flex items-center relative" (submit)="$event.preventDefault()">
            <input
              class="w-full h-11 pl-space-md pr-12 rounded-lg bg-surface-container-low text-on-surface placeholder:text-on-surface-variant/70 font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
              placeholder="Buscar trámites, resoluciones, comunicados..."
              type="search"
            /><button
              class="absolute right-1.5 w-8 h-8 rounded bg-primary text-on-primary flex items-center justify-center hover:bg-primary-container transition-colors"
              title="Buscar"
              type="submit"
            >
              <span class="material-symbols-outlined text-[18px]">search</span>
            </button>
          </form>
        </div>
        <div class="flex items-center gap-space-md">
          <a
            class="h-11 px-space-lg rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg flex items-center gap-space-xs transition-colors shadow-sm"
            href="#"
            ><span class="material-symbols-outlined text-[18px]">mark_email_unread</span
            ><span>Mesa de Partes Virtual</span></a
          >
          <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span class="material-symbols-outlined text-on-primary text-[18px]">person</span>
          </div>
        </div>
      </div>

      <!-- Bottom Nav Bar -->
      <div class="bg-surface-container-lowest shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
        <div class="max-w-7xl mx-auto px-gutter">
          <nav
            class="flex items-center gap-space-xs overflow-x-auto py-1 h-12"
          >
            <a
              routerLink="/"
              routerLinkActive="bg-primary-container text-on-primary"
              [routerLinkActiveOptions]="{ exact: true }"
              class="px-space-md py-2 whitespace-nowrap transition-colors font-label-lg text-label-lg rounded-lg"
              [class.bg-primary-container]="isExact('/')"
              [class.text-on-primary]="isExact('/')"
              [class.text-on-surface-variant]="!isExact('/')"
              [class.hover:text-on-surface]="!isExact('/')"
            >Inicio</a
            ><a
              routerLink="/institucional"
              routerLinkActive="bg-primary-container text-on-primary"
              class="px-space-md py-2 font-label-lg text-label-lg whitespace-nowrap transition-colors rounded-lg"
              [class.text-on-surface-variant]="!isActive('/institucional')"
              [class.hover:text-on-surface]="!isActive('/institucional')"
            >Institucional</a
            ><a
              routerLink="/tramites"
              routerLinkActive="bg-primary-container text-on-primary"
              class="px-space-md py-2 font-label-lg text-label-lg whitespace-nowrap transition-colors rounded-lg"
              [class.text-on-surface-variant]="!isActive('/tramites')"
              [class.hover:text-on-surface]="!isActive('/tramites')"
            >Servicios y Trámites</a
            ><a
              routerLink="/resoluciones"
              routerLinkActive="bg-primary-container text-on-primary"
              class="px-space-md py-2 font-label-lg text-label-lg whitespace-nowrap transition-colors rounded-lg"
              [class.text-on-surface-variant]="!isActive('/resoluciones')"
              [class.hover:text-on-surface]="!isActive('/resoluciones')"
            >Normativa y Resoluciones</a
            ><a
              routerLink="/obras-viales"
              routerLinkActive="bg-primary-container text-on-primary"
              class="px-space-md py-2 font-label-lg text-label-lg whitespace-nowrap transition-colors rounded-lg"
              [class.text-on-surface-variant]="!isActive('/obras-viales')"
              [class.hover:text-on-surface]="!isActive('/obras-viales')"
            >Obras y Proyectos Viales</a
            ><a
              routerLink="/noticias"
              routerLinkActive="bg-primary-container text-on-primary"
              class="px-space-md py-2 font-label-lg text-label-lg whitespace-nowrap transition-colors rounded-lg"
              [class.text-on-surface-variant]="!isActive('/noticias')"
              [class.hover:text-on-surface]="!isActive('/noticias')"
            >Noticias y Comunicados</a
            ><a
              routerLink="/contacto"
              routerLinkActive="bg-primary-container text-on-primary"
              class="px-space-md py-2 font-label-lg text-label-lg whitespace-nowrap transition-colors rounded-lg"
              [class.text-on-surface-variant]="!isActive('/contacto')"
              [class.hover:text-on-surface]="!isActive('/contacto')"
            >Participación y Contacto</a
            >
          </nav>
        </div>
      </div>
    </header>
  `,
})
export class HeaderComponent {
  private router = inject(Router);

  isExact(route: string): boolean {
    return this.router.url === route;
  }

  isActive(route: string): boolean {
    return this.router.url.startsWith(route);
  }
}
