import { Component } from '@angular/core';
import { HeroComponent } from './components/hero.component';
import { ServicesComponent } from './components/services.component';
import { NewsComponent } from './components/news.component';
import { DocumentsComponent } from './components/documents.component';
import { ProjectsComponent } from './components/projects.component';
import { FaqComponent } from './components/faq.component';
import { ComplaintComponent } from './components/complaint.component';
import { StaffComponent } from './components/staff.component';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [
    HeroComponent,
    ServicesComponent,
    NewsComponent,
    DocumentsComponent,
    ProjectsComponent,
    FaqComponent,
    ComplaintComponent,
    StaffComponent,
  ],
  template: `
    <div class="max-w-7xl mx-auto px-gutter py-space-xl">
      <app-hero />
      <app-services />
      <app-news />
      <app-documents />
      <app-projects />
      <app-faq />
      <app-complaint />
      <app-staff />
    </div>
  `,
})
export class InicioComponent {}
