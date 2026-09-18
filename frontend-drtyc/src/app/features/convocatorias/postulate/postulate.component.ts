import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PortalService } from '../../../core/services/portal.service';
import { JobCall } from '../../../core/interfaces/job-call.model';

@Component({
  selector: 'app-postulate',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './postulate.component.html',
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
