import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PortalService } from '../../../../core/services/portal.service';
import { Post } from '../../../../core/interfaces/post.model';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './news.component.html',
})
export class NewsComponent implements OnInit {
  private portalService = inject(PortalService);
  private apiUrl = environment.apiUrl.replace('/api/v1', '');

  posts = signal<Post[]>([]);
  cargando = signal(true);

  featuredPost = computed(() => this.posts()[0] ?? null);
  secondaryPosts = computed(() => this.posts().slice(1, 4));

  ngOnInit() {
    this.portalService.getPosts().subscribe({
      next: (res) => {
        console.log('Noticias cargadas:', res.data);
        this.posts.set(res.data.slice(0, 4));
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('Error al cargar las noticias:', err);
        this.cargando.set(false);
      }
    });
  }

  getImageUrl(path: string): string {
    return `${this.apiUrl}/storage/${path}`;
  }

  trackById(index: number, item: Post): number {
    return item.id;
  }
}
