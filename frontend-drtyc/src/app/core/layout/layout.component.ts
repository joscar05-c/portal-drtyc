import { Component, AfterViewInit, ElementRef, ViewChild, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './layout.component.html',
})
export class LayoutComponent implements AfterViewInit {
  @ViewChild('mainContent') mainContent!: ElementRef<HTMLElement>;

  ngAfterViewInit(): void {
    const header = document.querySelector('header');
    if (header && this.mainContent) {
      const updatePadding = () => {
        this.mainContent.nativeElement.style.paddingTop = header.offsetHeight + 'px';
      };
      updatePadding();
      new ResizeObserver(updatePadding).observe(header);
    }
  }
}
