import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { PortalService } from '../../../core/services/portal.service';
import { DocumentEntryTrack } from '../../../core/interfaces/document-entry.model';

@Component({
  selector: 'app-seguimiento',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './seguimiento.component.html',
})
export class SeguimientoComponent {
  private portalService = inject(PortalService);

  consultando = signal(false);
  expediente = signal<DocumentEntryTrack | null>(null);
  error = signal('');

  form = new FormGroup({
    tracking_number: new FormControl('', { validators: Validators.required }),
    document_number: new FormControl('', { validators: [Validators.required, Validators.minLength(8)] }),
  });

  consultar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.consultando.set(true);
    this.error.set('');
    this.expediente.set(null);

    this.portalService.trackDocumentEntry(
      this.form.value.tracking_number!,
      this.form.value.document_number!
    ).subscribe({
      next: (res) => {
        this.expediente.set(res);
        this.consultando.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'No se encontró el expediente con los datos proporcionados.');
        this.consultando.set(false);
      },
    });
  }

  fieldInvalid(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!ctrl && ctrl.invalid && ctrl.touched;
  }

  statusColor(status: string): string {
    const colors: Record<string, string> = {
      'Pendiente': 'bg-warning text-on-warning',
      'En Proceso': 'bg-info text-on-info',
      'Observado': 'bg-error text-on-error',
      'Atendido': 'bg-success text-on-success',
      'Rechazado': 'bg-error text-on-error',
    };
    return colors[status] || 'bg-outline text-on-surface';
  }
}
