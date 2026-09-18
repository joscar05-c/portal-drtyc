import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, catchError, of } from 'rxjs';
import { PortalService } from '../../../core/services/portal.service';
import { Post } from '../../../core/interfaces/post.model';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-noticias',
  standalone: true,
  imports: [RouterLink, DatePipe, UpperCasePipe],
  templateUrl: './noticias.component.html',
})
export class NoticiasComponent {
  private portalService = inject(PortalService);
  private apiUrl = environment.apiUrl.replace('/api/v1', '');

  busqueda = signal('');

  private allPosts = toSignal(
    this.portalService.getPosts().pipe(
      map(res => res.data),
      catchError(() => of([] as Post[]))
    ),
    { initialValue: [] as Post[] }
  );

  filtradas = computed(() => {
    const q = this.busqueda().toLowerCase();
    const items = this.allPosts();
    if (!q) return items;
    return items.filter(n =>
      n.title.toLowerCase().includes(q) ||
      (n.excerpt && n.excerpt.toLowerCase().includes(q))
    );
  });

  onBusqueda(event: Event): void {
    this.busqueda.set((event.target as HTMLInputElement).value);
  }

  getImageUrl(path: string): string {
    return `${this.apiUrl}/storage/${path}`;
  }
}
