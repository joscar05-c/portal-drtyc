import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-institucional',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-7xl mx-auto px-gutter py-space-xl">
      <!-- Encabezado Institucional -->
      <div class="mb-space-lg">
        <div class="flex items-center gap-space-sm mb-space-xs">
          <span class="material-symbols-outlined text-[28px] text-primary">account_balance</span>
          <h1 class="text-headline-lg text-primary font-bold">Institucional</h1>
        </div>
        <p class="text-body-md text-on-surface-variant">
          Conozca nuestra estructura organizacional, normativa y funciones de la Direcci&#243;n Regional de Transportes y Comunicaciones.
        </p>
      </div>

      <!-- Contenido -->
      <div class="bg-surface-container-lowest rounded-xl shadow-sm p-space-xl border border-outline-variant/30">
        <div class="flex flex-col items-center justify-center py-space-2xl text-center">
          <span class="material-symbols-outlined text-[64px] text-outline mb-space-md">construction</span>
          <p class="text-headline-sm text-on-surface font-semibold mb-space-xs">Secci&#243;n en construcci&#243;n</p>
          <p class="text-body-sm text-on-surface-variant">Pr&#243;ximamente encontrar&#225; aqu&#237; toda la informaci&#243;n institucional de la DRTC.</p>
        </div>
      </div>
    </div>
  `,
})
export class InstitucionalComponent {}
