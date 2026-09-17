import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PortalService } from '../../../core/services/portal.service';
import { Complaint } from '../../../core/interfaces/complaint.model';

@Component({
  selector: 'app-complaint',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <section class="w-full mb-space-xl" id="reclamos">
      <div class="bg-surface-container-lowest rounded-xl shadow-md p-space-lg md:p-space-xl">
        <!-- Encabezado -->
        <div class="mb-space-lg">
          <div class="flex items-center gap-space-xs text-error text-label-md uppercase tracking-wider mb-1">
            <span class="material-symbols-outlined text-[18px]">menu_book</span>
            <span>Atención Ciudadana y Defensa de Derechos</span>
          </div>
          <h2 class="text-headline-lg text-primary font-bold mb-space-xs">Libro de Reclamaciones Virtual</h2>
          <p class="text-body-sm text-on-surface-variant mb-space-md">
            Conforme a lo establecido en el C&#243;digo de Protecci&#243;n y Defensa del Consumidor (Ley N&#170; 29571), esta entidad pone a su disposici&#243;n este libro virtual para registrar su reclamo o queja formal.
          </p>
          <a routerLink="/seguimiento-reclamos"
             class="inline-flex items-center gap-2 px-space-md py-space-sm border border-outline text-secondary font-label-lg rounded-full hover:bg-surface-container transition-colors">
            <span class="material-symbols-outlined text-[20px]">manage_search</span>
            <span>Consultar estado de mi reclamo</span>
          </a>
        </div>

        @if (exito()) {
          <div class="mb-space-lg p-space-lg rounded-lg bg-surface-container-high text-primary flex items-start gap-space-md">
            <span class="material-symbols-outlined text-secondary text-[32px] shrink-0">task_alt</span>
            <div>
              <h4 class="text-headline-sm font-bold mb-1">¡Reclamo Registrado con Éxito!</h4>
              <p class="text-body-sm mb-2">Su código de seguimiento es: <strong class="font-bold font-mono text-secondary">{{ codigoSeguimiento() }}</strong>. Se ha remitido una copia digital a su correo consignado.</p>
              <button class="text-label-sm underline font-bold" (click)="exito.set(false)">Cerrar notificación</button>
            </div>
          </div>
        }

        <!-- Tipo de Incidencia -->
        <div class="bg-surface-container-low p-space-md rounded-lg mb-space-lg">
          <span class="block text-label-md font-bold text-primary mb-space-sm">1. Tipo de Incidencia a Registrar:</span>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-space-md">
            <label class="flex items-start gap-space-sm p-space-md rounded bg-surface-container-lowest cursor-pointer shadow-sm">
              <input class="mt-1 text-secondary focus:ring-secondary" type="radio" name="claim_type" value="reclamo"
                     [(ngModel)]="tipoIncidencia">
              <div>
                <span class="block text-label-lg font-bold text-on-surface">RECLAMO</span>
                <span class="text-body-sm text-on-surface-variant">Disconformidad relacionada directamente a los bienes o servicios públicos brindados.</span>
              </div>
            </label>
            <label class="flex items-start gap-space-sm p-space-md rounded bg-surface-container-lowest cursor-pointer shadow-sm">
              <input class="mt-1 text-secondary focus:ring-secondary" type="radio" name="claim_type" value="queja"
                     [(ngModel)]="tipoIncidencia">
              <div>
                <span class="block text-label-lg font-bold text-on-surface">QUEJA</span>
                <span class="text-body-sm text-on-surface-variant">Malestar o descontento respecto a la atención recibida o conducta del servidor público.</span>
              </div>
            </label>
          </div>
        </div>

        <!-- Formulario -->
        <form class="space-y-space-lg" (ngSubmit)="enviar()">
          <!-- Bloque 1: Datos Ciudadano -->
          <div>
            <h4 class="text-label-lg font-bold text-primary mb-space-md flex items-center gap-space-xs">
              <span class="material-symbols-outlined text-secondary text-[20px]">person</span>
              <span>2. Identificación del Ciudadano Reclamante</span>
            </h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
              <div>
                <label class="block text-label-sm text-on-surface-variant mb-1 font-semibold">N° de Documento *</label>
                <input class="w-full h-11 px-space-md rounded bg-surface-container-low text-on-surface text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                       placeholder="Ej. 45892147" required type="text" [(ngModel)]="formData.document_number" name="document_number">
              </div>
              <div class="sm:col-span-2">
                <label class="block text-label-sm text-on-surface-variant mb-1 font-semibold">Nombres y Apellidos Completos *</label>
                <input class="w-full h-11 px-space-md rounded bg-surface-container-low text-on-surface text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                       placeholder="Nombres y Apellidos" required type="text" [(ngModel)]="formData.full_name" name="full_name">
              </div>
              <div>
                <label class="block text-label-sm text-on-surface-variant mb-1 font-semibold">Correo Electrónico *</label>
                <input class="w-full h-11 px-space-md rounded bg-surface-container-low text-on-surface text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                       placeholder="su-correo@ejemplo.pe" required type="email" [(ngModel)]="formData.email" name="email">
              </div>
              <div>
                <label class="block text-label-sm text-on-surface-variant mb-1 font-semibold">Teléfono / Celular *</label>
                <input class="w-full h-11 px-space-md rounded bg-surface-container-low text-on-surface text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                       placeholder="987 654 321" required type="tel" [(ngModel)]="formData.phone" name="phone">
              </div>
            </div>
          </div>

          <!-- Bloque 2: Detalle -->
          <div>
            <h4 class="text-label-lg font-bold text-primary mb-space-md flex items-center gap-space-xs">
              <span class="material-symbols-outlined text-secondary text-[20px]">edit_note</span>
              <span>3. Detalle y Fundamento de la Queja o Reclamo</span>
            </h4>
            <div class="space-y-space-md">
              <div>
                <label class="block text-label-sm text-on-surface-variant mb-1 font-semibold">Descripción Detallada *</label>
                <textarea class="w-full p-space-md rounded bg-surface-container-low text-on-surface text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                          placeholder="Describa con precisión fechas, servidores intervinientes y circunstancias del servicio..."
                          required rows="4" [(ngModel)]="formData.details" name="details"></textarea>
              </div>
            </div>
          </div>

          <!-- Consentimiento y Envío -->
          <div class="pt-space-md space-y-space-md">
            <div class="flex flex-col sm:flex-row items-center gap-space-md">
              <button type="submit"
                      [disabled]="enviando()"
                      class="w-full sm:w-auto h-12 px-space-xl rounded bg-primary hover:bg-primary-container text-on-primary font-label-lg font-bold flex items-center justify-center gap-space-xs shadow-md transition-all disabled:opacity-50">
                @if (enviando()) {
                  <span class="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
                  <span>Enviando...</span>
                } @else {
                  <span class="material-symbols-outlined text-[20px]">send</span>
                  <span>Enviar Registro</span>
                }
              </button>
              <span class="text-label-sm text-outline">Plazo perentorio de respuesta oficial: 15 días hábiles.</span>
            </div>
            @if (errorEnvio()) {
              <p class="text-body-sm text-error flex items-center gap-1">
                <span class="material-symbols-outlined text-[16px]">error</span>
                {{ errorEnvio() }}
              </p>
            }
          </div>
        </form>
      </div>
    </section>
  `,
})
export class ComplaintComponent {
  private portalService = inject(PortalService);

  tipoIncidencia: 'queja' | 'reclamo' = 'reclamo';
  formData: Complaint = { document_number: '', full_name: '', email: '', phone: '', type: 'reclamo', details: '' };
  enviando = signal(false);
  exito = signal(false);
  codigoSeguimiento = signal('');
  errorEnvio = signal('');

  enviar(): void {
    this.enviando.set(true);
    this.errorEnvio.set('');
    this.formData.type = this.tipoIncidencia;

    this.portalService.sendComplaint(this.formData).subscribe({
      next: (res) => {
        this.enviando.set(false);
        this.exito.set(true);
        this.codigoSeguimiento.set(res.tracking_code);
        this.formData = { document_number: '', full_name: '', email: '', phone: '', type: 'reclamo', details: '' };
      },
      error: (err) => {
        this.enviando.set(false);
        this.errorEnvio.set(err.error?.message || 'Error al enviar el reclamo. Intente nuevamente.');
      },
    });
  }
}
