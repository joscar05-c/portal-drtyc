import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { PortalService } from '../../../core/services/portal.service';

@Component({
  selector: 'app-mesa-partes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './mesa-partes.component.html',
})
export class MesaPartesComponent {
  private portalService = inject(PortalService);

  submitted = signal(false);
  enviando = signal(false);
  trackingNumber = signal('');
  errorEnvio = signal('');

  mainFile: File | null = null;
  annexesFiles: File[] = [];

  form = new FormGroup({
    sender_type: new FormControl('', { validators: Validators.required }),
    document_number: new FormControl('', { validators: [Validators.required, Validators.minLength(8)] }),
    sender_name: new FormControl('', { validators: Validators.required }),
    email: new FormControl('', { validators: [Validators.required, Validators.email] }),
    phone: new FormControl('', { validators: Validators.required }),
    document_type: new FormControl('', { validators: Validators.required }),
    subject: new FormControl('', { validators: Validators.required }),
    folios: new FormControl(1, { validators: [Validators.required, Validators.min(1)] }),
  });

  onMainFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.mainFile = input.files?.[0] ?? null;
  }

  onAnnexesChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.annexesFiles = input.files ? Array.from(input.files) : [];
  }

  enviar(): void {
    if (this.form.invalid || !this.mainFile) {
      this.form.markAllAsTouched();
      return;
    }

    this.enviando.set(true);
    this.errorEnvio.set('');

    const fd = new FormData();
    fd.append('sender_type', this.form.value.sender_type!);
    fd.append('document_number', this.form.value.document_number!);
    fd.append('sender_name', this.form.value.sender_name!);
    fd.append('email', this.form.value.email!);
    fd.append('phone', this.form.value.phone!);
    fd.append('document_type', this.form.value.document_type!);
    fd.append('subject', this.form.value.subject!);
    fd.append('folios', String(this.form.value.folios!));
    fd.append('main_file', this.mainFile);

    this.annexesFiles.forEach((file) => {
      fd.append('annexes[]', file);
    });

    this.portalService.submitDocumentEntry(fd).subscribe({
      next: (res) => {
        this.trackingNumber.set(res.tracking_number);
        this.submitted.set(true);
        this.enviando.set(false);
      },
      error: (err) => {
        this.errorEnvio.set(err.error?.message || 'Error al enviar el documento. Intente nuevamente.');
        this.enviando.set(false);
      },
    });
  }

  fieldInvalid(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!ctrl && ctrl.invalid && ctrl.touched;
  }
}
