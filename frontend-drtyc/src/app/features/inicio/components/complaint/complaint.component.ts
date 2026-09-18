import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PortalService } from '../../../../core/services/portal.service';
import { Complaint } from '../../../../core/interfaces/complaint.model';

@Component({
  selector: 'app-complaint',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './complaint.component.html',
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
