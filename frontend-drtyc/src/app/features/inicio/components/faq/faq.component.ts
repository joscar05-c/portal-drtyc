import { Component, OnInit, inject, signal } from '@angular/core';
import { PortalService } from '../../../../core/services/portal.service';
import { Faq } from '../../../../core/interfaces/faq.model';

@Component({
  selector: 'app-faq',
  standalone: true,
  templateUrl: './faq.component.html',
})
export class FaqComponent implements OnInit {
  private portalService = inject(PortalService);
  faqs = signal<Faq[]>([]);
  cargando = signal(true);
  abierto = signal<number | null>(null);

  ngOnInit(): void {
    this.portalService.getFaqs().subscribe({
      next: (data) => { this.faqs.set(data); this.cargando.set(false); },
      error: () => this.cargando.set(false),
    });
  }

  toggle(index: number): void {
    this.abierto.set(this.abierto() === index ? null : index);
  }
}
