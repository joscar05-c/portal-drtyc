import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PortalService } from '../../core/services/portal.service';
import { JobCall } from '../../core/interfaces/job-call.model';

@Component({
  selector: 'app-postulate',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="max-w-3xl mx-auto px-gutter py-space-xl">

      <!-- Loading -->
      @if (cargando()) {
        <div class="space-y-space-md animate-pulse">
          <div class="h-8 bg-surface-container-high rounded w-2/3"></div>
          <div class="h-4 bg-surface-container-high rounded w-1/3"></div>
          <div class="h-40 bg-surface-container-high rounded"></div>
        </div>

      <!-- Error -->
      } @else if (error()) {
        <div class="p-space-xl text-center bg-surface-container-lowest rounded-xl shadow-md">
          <span class="material-symbols-outlined text-[48px] text-error mb-space-md block">error</span>
          <p class="text-headline-sm text-on-surface font-bold mb-1">{{ error() }}</p>
          <a routerLink="/convocatorias" class="inline-flex items-center gap-1 text-label-lg text-secondary hover:underline font-bold mt-space-md">
            <span class="material-symbols-outlined text-[18px]">arrow_back</span>
            Volver a Convocatorias
          </a>
        </div>

      <!-- Formulario -->
      } @else if (convocatoria()) {
        <div class="mb-space-lg">
          <a routerLink="/convocatorias" class="inline-flex items-center gap-1 text-label-sm text-secondary hover:underline font-bold mb-space-md">
            <span class="material-symbols-outlined text-[16px]">arrow_back</span>
            Volver a Convocatorias
          </a>
          <h1 class="text-headline-lg text-primary font-bold mb-space-xs">Postular</h1>
          <p class="text-body-md text-on-surface-variant">{{ convocatoria()!.title }}</p>
        </div>

        <!-- Éxito -->
        @if (exito()) {
          <div class="mb-space-lg p-space-lg rounded-lg bg-secondary/10 text-on-surface flex items-start gap-space-md border border-secondary/20">
            <span class="material-symbols-outlined text-secondary text-[32px] shrink-0">task_alt</span>
            <div>
              <h4 class="text-headline-sm font-bold mb-1">Postulaci&#243;n Enviada</h4>
              <p class="text-body-sm mb-2">Su postulaci&#243;n fue registrada exitosamente. Guarde su n&#250;mero de documento para seguimiento.</p>
              <a routerLink="/convocatorias" class="text-label-sm underline font-bold text-secondary">Volver a Convocatorias</a>
            </div>
          </div>
        }

        <!-- Formulario -->
        @if (!exito()) {
          <form (ngSubmit)="enviar()" class="bg-surface-container-lowest rounded-xl shadow-md p-space-lg md:p-space-xl space-y-space-lg">

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
              <div>
                <label class="block text-label-sm text-on-surface-variant mb-1 font-semibold">N&#176; de Documento (DNI/CE) *</label>
                <input class="w-full h-11 px-space-md rounded bg-surface-container-low text-on-surface text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                       placeholder="Ej. 45892147" required type="text" [(ngModel)]="formData.document_number" name="document_number">
              </div>
              <div>
                <label class="block text-label-sm text-on-surface-variant mb-1 font-semibold">Tel&#233;fono / Celular *</label>
                <input class="w-full h-11 px-space-md rounded bg-surface-container-low text-on-surface text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                       placeholder="987 654 321" required type="tel" [(ngModel)]="formData.phone" name="phone">
              </div>
            </div>

            <div>
              <label class="block text-label-sm text-on-surface-variant mb-1 font-semibold">Nombres y Apellidos Completos *</label>
              <input class="w-full h-11 px-space-md rounded bg-surface-container-low text-on-surface text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                     placeholder="Nombres y Apellidos" required type="text" [(ngModel)]="formData.full_name" name="full_name">
            </div>

            <div>
              <label class="block text-label-sm text-on-surface-variant mb-1 font-semibold">Correo Electr&#243;nico *</label>
              <input class="w-full h-11 px-space-md rounded bg-surface-container-low text-on-surface text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                     placeholder="su-correo@ejemplo.pe" required type="email" [(ngModel)]="formData.email" name="email">
            </div>

            <div>
              <label class="block text-label-sm text-on-surface-variant mb-1 font-semibold">CV y Anexos (PDF, m&#225;x. 10MB) *</label>
              <input class="w-full h-11 px-space-md rounded bg-surface-container-low text-on-surface text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-on-primary hover:file:bg-primary-container"
                     required type="file" accept=".pdf,application/pdf" (change)="onFileSelected($event)">
              <span class="text-label-sm text-outline mt-1 block">Solo se aceptan archivos PDF</span>
            </div>

            <div class="pt-space-md flex flex-col sm:flex-row items-center gap-space-md">
              <button type="submit"
                      [disabled]="enviando() || !formData.file"
                      class="w-full sm:w-auto h-12 px-space-xl rounded bg-primary hover:bg-primary-container text-on-primary font-label-lg font-bold flex items-center justify-center gap-space-xs shadow-md transition-all disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed">
                @if (enviando()) {
                  <span class="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
                  <span>Enviando...</span>
                } @else {
                  <span class="material-symbols-outlined text-[20px]">send</span>
                  <span>Enviar Postulaci&#243;n</span>
                }
              </button>
              <span class="text-label-sm text-outline">El archivo debe ser un PDF con su CV y anexos.</span>
            </div>

            @if (errorEnvio()) {
              <p class="text-body-sm text-error flex items-center gap-1">
                <span class="material-symbols-outlined text-[16px]">error</span>
                {{ errorEnvio() }}
              </p>
            }
          </form>
        }
      }
    </div>
  `,
})
export class PostulateComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private portalService = inject(PortalService);

  convocatoria = signal<JobCall | null>(null);
  cargando = signal(true);
  error = signal('');
  enviando = signal(false);
  exito = signal(false);
  errorEnvio = signal('');

  formData = {
    document_number: '',
    full_name: '',
    email: '',
    phone: '',
    file: null as File | null,
  };

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (!slug) {
      this.error.set('Convocatoria no encontrada.');
      this.cargando.set(false);
      return;
    }

    this.portalService.getJobCallBySlug(slug).subscribe({
      next: (data) => {
        this.convocatoria.set(data);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('Convocatoria no encontrada.');
        this.cargando.set(false);
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.formData.file = input.files[0];
    }
  }

  enviar(): void {
    if (!this.formData.file || !this.convocatoria()) return;

    this.enviando.set(true);
    this.errorEnvio.set('');

    const formData = new FormData();
    formData.append('job_call_id', String(this.convocatoria()!.id));
    formData.append('document_number', this.formData.document_number);
    formData.append('full_name', this.formData.full_name);
    formData.append('email', this.formData.email);
    formData.append('phone', this.formData.phone);
    formData.append('file', this.formData.file);

    const apiUrl = 'http://127.0.0.1:8000';

    fetch(`${apiUrl}/api/v1/postulate`, {
      method: 'POST',
      body: formData,
    })
      .then(res => res.json().then(data => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        this.enviando.set(false);
        if (ok) {
          this.exito.set(true);
        } else {
          this.errorEnvio.set(data.message || 'Error al enviar la postulaci\u00f3n.');
        }
      })
      .catch(() => {
        this.enviando.set(false);
        this.errorEnvio.set('Error de conexi\u00f3n. Intente nuevamente.');
      });
  }
}
