import { Component, OnInit, inject, signal } from '@angular/core';
import { PortalService } from '../../../../core/services/portal.service';
import { StaffMember } from '../../../../core/interfaces/staff.model';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-staff',
  standalone: true,
  templateUrl: './staff.component.html',
})
export class StaffComponent implements OnInit {
  private portalService = inject(PortalService);
  staff = signal<StaffMember[]>([]);
  cargando = signal(true);
  private apiUrl = environment.apiUrl.replace('/api/v1', '');

  ngOnInit(): void {
    this.portalService.getStaff().subscribe({
      next: (data) => { this.staff.set(data); this.cargando.set(false); },
      error: () => this.cargando.set(false),
    });
  }

  getImageUrl(path: string): string {
    return `${this.apiUrl}/storage/${path}`;
  }
}
