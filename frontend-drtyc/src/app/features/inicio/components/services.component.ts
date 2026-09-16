import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="w-full mb-space-xl" id="tramites">
      <div class="flex flex-col md:flex-row md:items-end justify-between mb-space-lg gap-space-md">
        <div>
          <div class="flex items-center gap-space-xs text-secondary text-label-md uppercase tracking-wider mb-1">
            <span class="material-symbols-outlined text-[18px]">touch_app</span>
            <span>Plataforma de Atención Virtual</span>
          </div>
          <h2 class="text-headline-lg text-primary font-bold">Servicios y Trámites Digitales Frecuentes</h2>
        </div>
        <div class="w-full md:w-80 relative">
          <input class="w-full h-11 pl-space-md pr-10 rounded bg-surface-container-lowest text-on-surface text-body-sm shadow-sm focus:outline-none focus:bg-surface-container-low transition-all"
                 placeholder="Buscar trámite: brevete, TUC, récord..."
                 type="text"
                 [value]="busqueda()"
                 (input)="onBusqueda($event)">
          <span class="material-symbols-outlined absolute right-3 top-3 text-outline text-[20px]">search</span>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-md">
        @for (tramite of tramitesFiltrados(); track tramite.titulo) {
          <div class="p-space-lg rounded-lg bg-surface-container-lowest shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div class="flex items-start justify-between gap-space-sm mb-space-md">
                <div class="w-12 h-12 rounded flex items-center justify-center transition-colors"
                     [class]="tramite.iconoBg">
                  <span class="material-symbols-outlined text-[28px]">{{ tramite.icono }}</span>
                </div>
                <span class="px-space-sm py-0.5 rounded text-label-sm font-semibold"
                      [class]="tramite.badgeClass">{{ tramite.badge }}</span>
              </div>
              <h3 class="text-headline-sm text-on-surface group-hover:text-secondary font-bold mb-space-xs transition-colors">
                {{ tramite.titulo }}
              </h3>
              <p class="text-body-sm text-on-surface-variant mb-space-md">
                {{ tramite.descripcion }}
              </p>
            </div>
            <div class="pt-space-sm flex items-center justify-between">
              <span class="text-label-sm text-outline">{{ tramite.meta }}</span>
              <a class="text-label-md text-secondary font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform" [routerLink]="tramite.ruta">
                <span>{{ tramite.accion }}</span>
                <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
              </a>
            </div>
          </div>
        }
      </div>
    </section>
  `,
})
export class ServicesComponent {
  busqueda = signal('');

  private servicios = [
    { titulo: 'Consulta de Licencias de Conducir', descripcion: 'Consulta estado de trámite, récord de puntos y requisitos para obtención, duplicado o revalidación de Brevetes Clase A y B.', icono: 'badge', iconoBg: 'bg-surface-container-high text-secondary group-hover:bg-secondary group-hover:text-on-secondary', badge: 'En Línea', badgeClass: 'bg-surface-container-low text-secondary', meta: 'Plazo: Inmediato', accion: 'Iniciar Consulta', ruta: '/tramites/licencias' },
    { titulo: 'Mesa de Partes Digital 24/7', descripcion: 'Ingreso formal de documentos, solicitudes, oficios y recursos administrativos con asignación de número de expediente.', icono: 'mark_email_unread', iconoBg: 'bg-primary-container text-on-primary group-hover:bg-primary', badge: 'Trámite Clave', badgeClass: 'bg-primary text-on-primary', meta: 'Disponibilidad: 24 Horas', accion: 'Ingresar Documento', ruta: '/tramites/mesa-partes' },
    { titulo: 'Récord de Conductor y Papeletas', descripcion: 'Verificación de infracciones impuestas por la DRTC y SUTRAN, cómputo de puntos firmes y récord formal.', icono: 'receipt_long', iconoBg: 'bg-surface-container-high text-secondary group-hover:bg-secondary group-hover:text-on-secondary', badge: 'Consulta Rápida', badgeClass: 'bg-surface-container-low text-secondary', meta: 'Costo: Gratuito', accion: 'Ver Récord', ruta: '/tramites/record' },
    { titulo: 'Depósito Vehicular y Liberación', descripcion: 'Procedimiento reglamentario, liquidación de costos de guardianía e inventario vehicular para retiro de unidades.', icono: 'local_parking', iconoBg: 'bg-surface-container-high text-secondary group-hover:bg-secondary group-hover:text-on-secondary', badge: 'Orientación', badgeClass: 'bg-surface-container text-on-surface-variant', meta: 'Sede: Depósito Regional', accion: 'Requisitos', ruta: '/tramites/deposito' },
    { titulo: 'Habilitación Vehicular y Carga', descripcion: 'Emisión y renovación de Tarjetas Únicas de Circulación (TUC) para flotas de carga pesada y transporte regular.', icono: 'local_shipping', iconoBg: 'bg-surface-container-high text-secondary group-hover:bg-secondary group-hover:text-on-secondary', badge: 'Empresas', badgeClass: 'bg-surface-container-low text-secondary', meta: 'Plazo: 5 días hábiles', accion: 'Gestionar TUC', ruta: '/tramites/tuc' },
    { titulo: 'Tasas y Aranceles Banco de la Nación', descripcion: 'Consulta los códigos de tributo oficial Págalo.pe y códigos de cuenta corriente para el pago de derechos.', icono: 'payments', iconoBg: 'bg-surface-container-high text-secondary group-hover:bg-secondary group-hover:text-on-secondary', badge: 'Pagos', badgeClass: 'bg-surface-container-low text-secondary', meta: 'Canal: Págalo.pe / Agentes', accion: 'Ver Códigos', ruta: '/tramites/tasas' },
  ];

  tramitesFiltrados = signal(this.servicios);

  onBusqueda(event: Event): void {
    const valor = (event.target as HTMLInputElement).value;
    this.busqueda.set(valor);
    const q = valor.toLowerCase();
    if (!q) {
      this.tramitesFiltrados.set(this.servicios);
    } else {
      this.tramitesFiltrados.set(
        this.servicios.filter(s => s.titulo.toLowerCase().includes(q) || s.descripcion.toLowerCase().includes(q))
      );
    }
  }
}
