import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroComponent } from './components/hero/hero.component';
import { ServicesComponent } from './components/services/services.component';
import { NewsComponent } from './components/news/news.component';
import { DocumentsComponent } from './components/documents/documents.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { FaqComponent } from './components/faq/faq.component';
import { ComplaintComponent } from './components/complaint/complaint.component';
import { StaffComponent } from './components/staff/staff.component';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [
    CommonModule,
    HeroComponent,
    ServicesComponent,
    NewsComponent,
    DocumentsComponent,
    ProjectsComponent,
    FaqComponent,
    ComplaintComponent,
    StaffComponent,
  ],
  templateUrl: './inicio.component.html',
})
export class InicioComponent {}
