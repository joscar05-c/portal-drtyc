import { Component, OnInit, inject, signal } from '@angular/core';
import { PortalService } from '../../../core/services/portal.service';
import { Faq } from '../../../core/interfaces/faq.model';

@Component({
  selector: 'app-faq',
  standalone: true,
  template: `
    <section class="w-full mb-space-xl">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-space-xl">
        <!-- TUPA Column -->
        <div class="lg:col-span-4 bg-primary text-on-primary p-space-lg md:p-space-xl rounded-xl flex flex-col justify-between shadow-md">
          <div>
            <div class="w-12 h-12 rounded bg-on-primary/15 flex items-center justify-center mb-space-md">
              <span class="material-symbols-outlined text-[28px] text-surface-variant">menu_book</span>
            </div>
            <span class="text-label-sm text-surface-variant font-bold uppercase tracking-wider block mb-1">Guía Oficial de Procedimientos</span>
            <h3 class="text-headline-lg font-bold mb-space-sm leading-snug">
              Texto Único de Procedimientos Administrativos (TUPA 2025)
            </h3>
            <p class="text-body-md text-surface-variant mb-space-lg leading-relaxed">
              Consulte las tasas vigentes, requisitos legales obligatorios, plazos perentorios de resolución y tipos de silencio administrativo.
            </p>
          </div>
          <div class="space-y-space-sm pt-space-md">
            <a class="w-full h-12 rounded bg-secondary hover:bg-on-secondary-fixed-variant text-on-secondary font-semibold flex items-center justify-center gap-space-xs shadow-sm transition-all" href="#">
              <span class="material-symbols-outlined text-[20px]">download</span>
              <span>Descargar TUPA Completo (PDF)</span>
            </a>
            <a class="w-full h-12 rounded bg-on-primary/10 hover:bg-on-primary/20 text-on-primary font-semibold flex items-center justify-center gap-space-xs transition-all" href="#">
              <span class="material-symbols-outlined text-[20px]">manage_search</span>
              <span>Buscador Interactivo de Tasas</span>
            </a>
          </div>
        </div>

        <!-- FAQ Column -->
        <div class="lg:col-span-8 flex flex-col justify-center">
          <div class="mb-space-md">
            <div class="flex items-center gap-space-xs text-secondary text-label-md uppercase tracking-wider mb-1">
              <span class="material-symbols-outlined text-[18px]">help_center</span>
              <span>Orientación al Usuario</span>
            </div>
            <h2 class="text-headline-lg text-primary font-bold">Preguntas Frecuentes y Trámites Paso a Paso</h2>
          </div>

          @if (cargando()) {
            <div class="space-y-space-sm">
              @for (i of [1, 2, 3]; track i) {
                <div class="bg-surface-container-lowest rounded-lg shadow-sm animate-pulse p-space-md h-14"></div>
              }
            </div>
          } @else if (faqs().length > 0) {
            <div class="space-y-space-sm">
              @for (faq of faqs(); track faq.id; let i = $index) {
                <div class="rounded-lg bg-surface-container-lowest shadow-sm overflow-hidden">
                  <button class="w-full p-space-md text-left flex items-center justify-between gap-space-md hover:bg-surface-container-low transition-colors"
                          (click)="toggle(i)">
                    <span class="text-headline-sm text-on-surface font-semibold">
                      {{ faq.question }}
                    </span>
                    <span class="material-symbols-outlined text-secondary transition-transform duration-300"
                          [class.rotate-180]="abierto() === i">
                      expand_more
                    </span>
                  </button>
                  @if (abierto() === i) {
                    <div class="px-space-md pb-space-md text-body-sm text-on-surface-variant">
                      <div class="space-y-2 pt-2" [innerHTML]="faq.answer"></div>
                    </div>
                  }
                </div>
              }
            </div>
          } @else {
            <div class="p-8 text-center bg-surface-container-lowest rounded-lg shadow-sm">
              <span class="material-symbols-outlined text-[48px] text-outline mb-space-md block">help_outline</span>
              <p class="text-headline-sm text-on-surface font-bold mb-1">No hay preguntas frecuentes</p>
              <p class="text-body-sm text-on-surface-variant">Próximamente se publicarán las FAQs</p>
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class FaqComponent implements OnInit {
  private portalService = inject(PortalService);
  faqs = signal<Faq[]>([]);
  cargando = signal(true);
  abierto = signal<number | null>(null);

  ngOnInit(): void {
    this.portalService.getFaqs().subscribe({
      next: (data) => { this.faqs.set(data); this.cargando.set(false); },
      error: () => this.cargando.set(false),
    });
  }

  toggle(index: number): void {
    this.abierto.set(this.abierto() === index ? null : index);
  }
}
