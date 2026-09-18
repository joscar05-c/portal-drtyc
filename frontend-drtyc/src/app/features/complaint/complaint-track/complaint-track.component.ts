import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { PortalService } from '../../../core/services/portal.service';
import { ComplaintTrackResult } from '../../../core/interfaces/complaint.model';

@Component({
  selector: 'app-complaint-track',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './complaint-track.component.html',
})
export class ComplaintTrackComponent {
  private fb = inject(FormBuilder);
  private portalService = inject(PortalService);

  form = this.fb.group({
    trackingCode: ['', Validators.required],
    documentNumber: ['', Validators.required],
  });

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  trackResult = signal<ComplaintTrackResult | null>(null);

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.trackResult.set(null);

    const { trackingCode, documentNumber } = this.form.value;

    this.portalService.trackComplaint({
      tracking_code: trackingCode!,
      document_number: documentNumber!,
    }).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.trackResult.set(res);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(
          err.error?.message || 'No se encontró un reclamo con los datos proporcionados.'
        );
      },
    });
  }

  getEstadoClase(status: string): string {
    switch (status) {
      case 'pendiente': return 'bg-error/15 text-error';
      case 'en_proceso': return 'bg-tertiary-fixed text-on-tertiary-container';
      case 'atendido': return 'bg-secondary/15 text-secondary';
      default: return 'bg-surface-container text-on-surface-variant';
    }
  }

  getEstadoIcon(status: string): string {
    switch (status) {
      case 'pendiente': return 'pending';
      case 'en_proceso': return 'autorenew';
      case 'atendido': return 'task_alt';
      default: return 'help';
    }
  }
}
