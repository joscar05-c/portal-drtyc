import { Component, OnInit, inject, signal } from '@angular/core';
import { PortalService } from '../../../core/services/portal.service';
import { StaffMember } from '../../../core/interfaces/staff.model';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-staff',
  standalone: true,
  template: `
    <section class="w-full mb-space-lg">
      <div class="flex flex-col md:flex-row md:items-end justify-between mb-space-lg gap-space-md">
        <div>
          <div class="flex items-center gap-space-xs text-secondary text-label-md uppercase tracking-wider mb-1">
            <span class="material-symbols-outlined text-[18px]">badge</span>
            <span>Transparencia y Gestión Pública</span>
          </div>
          <h2 class="text-headline-lg text-primary font-bold">Plana Directiva y Autoridades Regionales</h2>
        </div>
      </div>

      @if (cargando()) {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
          @for (i of [1, 2, 3, 4]; track i) {
            <div class="bg-surface-container-lowest rounded-lg shadow-sm animate-pulse p-space-md flex flex-col items-center">
              <div class="w-24 h-24 rounded-full bg-surface-container-high mb-space-sm"></div>
              <div class="h-4 bg-surface-container-high rounded w-3/4 mb-2"></div>
              <div class="h-3 bg-surface-container-high rounded w-1/2"></div>
            </div>
          }
        </div>
      } @else if (staff().length > 0) {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
          @for (miembro of staff(); track miembro.id) {
            <div class="bg-surface-container-lowest rounded-lg shadow-sm hover:shadow-md transition-all p-space-md flex flex-col items-center text-center">
              <div class="w-24 h-24 rounded-full overflow-hidden mb-space-sm shadow-inner bg-surface-container">
                @if (miembro.photo_path) {
                  <img class="w-full h-full object-cover" [src]="getImageUrl(miembro.photo_path)" [alt]="miembro.full_name">
                } @else {
                  <div class="w-full h-full flex items-center justify-center">
                    <span class="material-symbols-outlined text-[40px] text-outline">person</span>
                  </div>
                }
              </div>
              <span class="px-space-sm py-0.5 rounded text-label-sm font-bold bg-surface-container text-secondary mb-1">
                {{ miembro.position }}
              </span>
              <h4 class="text-headline-sm text-primary font-bold mb-0.5">{{ miembro.full_name }}</h4>
              <div class="w-full bg-surface-container-low p-space-sm rounded text-label-sm text-on-surface-variant space-y-1 mb-space-md mt-space-sm">
                @if (miembro.email) {
                  <p class="truncate">{{ miembro.email }}</p>
                }
                @if (miembro.phone) {
                  <p>Anexo: {{ miembro.phone }}</p>
                }
              </div>
            </div>
          }
        </div>
      } @else {
        <div class="p-12 text-center bg-surface-container-lowest rounded-lg shadow-sm">
          <span class="material-symbols-outlined text-[48px] text-outline mb-space-md block">badge</span>
          <p class="text-headline-sm text-on-surface font-bold mb-1">No hay directores registrados</p>
          <p class="text-body-sm text-on-surface-variant">Próximamente se publicará el directorio</p>
        </div>
      }
    </section>
  `,
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
