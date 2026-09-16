import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="bg-surface-container-low text-on-surface py-space-xl">
      <div class="max-w-7xl mx-auto px-gutter grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-xl mb-space-xl">
        <!-- Col 1: Logo + Descripción -->
        <div>
          <div class="flex items-center gap-space-sm mb-space-md">
            <span class="material-symbols-outlined text-primary text-[28px]">account_balance</span>
            <div class="flex flex-col">
              <span class="font-bold text-headline-sm text-primary">DRTC</span>
              <span class="text-label-sm text-on-surface-variant">Gobierno Regional</span>
            </div>
          </div>
          <p class="text-body-sm text-on-surface-variant mb-space-md">
            Dirección Regional de Transportes y Comunicaciones, entidad encargada de promover, autorizar y fiscalizar el sistema integral de transporte terrestre y las telecomunicaciones departamentales.
          </p>
          <div class="flex items-center gap-space-sm">
            <a class="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-colors" href="#" title="Facebook">
              <span class="material-symbols-outlined text-[18px]">public</span>
            </a>
            <a class="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-colors" href="#" title="X">
              <span class="material-symbols-outlined text-[18px]">tag</span>
            </a>
            <a class="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-colors" href="#" title="YouTube">
              <span class="material-symbols-outlined text-[18px]">play_circle</span>
            </a>
          </div>
        </div>

        <!-- Col 2: Trámites -->
        <div>
          <h4 class="text-label-lg font-bold text-primary uppercase tracking-wider mb-space-md">Trámites Principales</h4>
          <ul class="space-y-space-sm">
            <li><a href="#" class="text-body-sm text-on-surface-variant hover:text-secondary transition-colors">Consulta de Licencias</a></li>
            <li><a href="#" class="text-body-sm text-on-surface-variant hover:text-secondary transition-colors">Estado de Papeletas</a></li>
            <li><a href="#" class="text-body-sm text-on-surface-variant hover:text-secondary transition-colors">Mesa de Partes Virtual</a></li>
            <li><a href="#" class="text-body-sm text-on-surface-variant hover:text-secondary transition-colors">Habilitación Vehicular</a></li>
            <li><a href="#" class="text-body-sm text-on-surface-variant hover:text-secondary transition-colors">Tarjeta Única de Circulación</a></li>
          </ul>
        </div>

        <!-- Col 3: Normativa -->
        <div>
          <h4 class="text-label-lg font-bold text-primary uppercase tracking-wider mb-space-md">Normativa</h4>
          <ul class="space-y-space-sm">
            <li><a href="#" class="text-body-sm text-on-surface-variant hover:text-secondary transition-colors">Resoluciones 2025</a></li>
            <li><a href="#" class="text-body-sm text-on-surface-variant hover:text-secondary transition-colors">TUPA Vigente</a></li>
            <li><a href="#" class="text-body-sm text-on-surface-variant hover:text-secondary transition-colors">Constituciones Regionales</a></li>
            <li><a href="#" class="text-body-sm text-on-surface-variant hover:text-secondary transition-colors">Directivas Institucionales</a></li>
          </ul>
        </div>

        <!-- Col 4: Contacto -->
        <div>
          <h4 class="text-label-lg font-bold text-primary uppercase tracking-wider mb-space-md">Sede Institucional</h4>
          <div class="space-y-space-sm text-body-sm text-on-surface-variant">
            <p class="flex items-start gap-space-xs">
              <span class="material-symbols-outlined text-secondary text-[18px] mt-0.5">location_on</span>
              <span>Jr. Los Libertadores S/N, Complejo Administrativo Regional</span>
            </p>
            <p class="flex items-center gap-space-xs">
              <span class="material-symbols-outlined text-secondary text-[18px]">schedule</span>
              <span>Lunes a Viernes, 08:00 a 16:30 hrs</span>
            </p>
            <p class="flex items-center gap-space-xs">
              <span class="material-symbols-outlined text-secondary text-[18px]">call</span>
              <span>Central Telefónica: (084) 231-800</span>
            </p>
            <p class="flex items-center gap-space-xs">
              <span class="material-symbols-outlined text-secondary text-[18px]">mail</span>
              <span>informes&#64;drtc.gob.pe</span>
            </p>
          </div>
        </div>
      </div>

      <!-- Barra inferior -->
      <div class="max-w-7xl mx-auto px-gutter border-t border-surface-container-high pt-space-lg">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-space-sm text-label-sm text-on-surface-variant">
          <span>&copy; {{ anioActual }} Dirección Regional de Transportes y Comunicaciones. Todos los derechos reservados.</span>
          <span class="text-outline">Plataforma institucional de gobierno digital</span>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  anioActual = new Date().getFullYear();
}
