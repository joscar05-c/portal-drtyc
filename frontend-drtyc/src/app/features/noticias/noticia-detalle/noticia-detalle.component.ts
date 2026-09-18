import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, catchError, of, switchMap } from 'rxjs';
import { PortalService } from '../../../core/services/portal.service';
import { Post } from '../../../core/interfaces/post.model';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-noticia-detalle',
  standalone: true,
  imports: [RouterLink, DatePipe, UpperCasePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './noticia-detalle.component.html',
})
export class NoticiaDetalleComponent {
  private route = inject(ActivatedRoute);
  private portalService = inject(PortalService);
  private apiUrl = environment.apiUrl.replace('/api/v1', '');

  noticia = toSignal(
    this.route.params.pipe(
      map(params => params['slug']),
      switchMap(slug => slug
        ? this.portalService.getPostBySlug(slug).pipe(
            catchError(() => of(null))
          )
        : of(null)
      )
    ),
    { initialValue: null as Post | null }
  );

  getImageUrl(path: string): string {
    return `${this.apiUrl}/storage/${path}`;
  }
}
