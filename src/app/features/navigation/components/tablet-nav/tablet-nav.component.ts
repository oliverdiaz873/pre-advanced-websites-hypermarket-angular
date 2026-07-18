import { Component, ViewChild, ElementRef, inject, Renderer2, effect, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { IconComponent } from '../../../../shared/components/icons/icons.component';
import { categories } from '../../../../data/categories.data';
import { ViewportService } from '@core/services/viewport.service';
import { getUrlFragment } from '../../../../core/utils/url.utils';

@Component({
  selector: 'app-tablet-nav',
  standalone: true,
  imports: [RouterLink, TranslatePipe, IconComponent],
  templateUrl: './tablet-nav.component.html',
  styleUrls: ['./tablet-nav.component.scss']
})
export class TabletNavComponent {
  @ViewChild('navRef', { read: ElementRef }) private navRef!: ElementRef;

  private renderer = inject(Renderer2);
  private viewportService = inject(ViewportService);
  protected categories = categories;

  constructor() {
    effect(() => {
      if (this.viewportService.viewportMode() !== 'tablet' && this.navRef) {
        this.closeAllSubmenus();
      }
    });
  }

  getFragment(href: string): string {
    return getUrlFragment(href);
  }

  private isTablet(): boolean {
    return this.viewportService.viewportMode() === 'tablet';
  }

  private getDirectSubmenu(element: Element | null): HTMLUListElement | null {
    const sibling = element?.nextElementSibling;
    return sibling instanceof HTMLUListElement ? sibling : null;
  }

  private closeAllSubmenus(): void {
    const nav = this.navRef.nativeElement;
    nav.querySelectorAll('ul.tablet-active').forEach((submenu: Element) => {
      this.renderer.removeClass(submenu, 'tablet-active');
    });
    (nav.querySelectorAll('[data-tablet-trigger]') as NodeListOf<HTMLElement>).forEach((trigger: HTMLElement) => {
      if (trigger.tagName === 'BUTTON') {
        this.renderer.setAttribute(trigger, 'aria-expanded', 'false');
      }
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.isTablet() || !this.navRef) return;

    const nav = this.navRef.nativeElement;
    const target = event.target as HTMLElement;

    if (!nav.contains(target)) {
      this.closeAllSubmenus();
      return;
    }

    const topLevelButton = target.closest('[data-tablet-trigger="level-1"]');
    if (topLevelButton && nav.contains(topLevelButton)) {
      const submenu = this.getDirectSubmenu(topLevelButton);
      if (!submenu) return;

      event.preventDefault();
      event.stopPropagation();

      const isOpen = submenu.classList.contains('tablet-active');
      this.closeAllSubmenus();

      if (!isOpen) {
        this.renderer.addClass(submenu, 'tablet-active');
        this.renderer.setAttribute(topLevelButton, 'aria-expanded', 'true');
      }
      return;
    }

    const nestedLink = target.closest('[data-tablet-trigger="level-2"]');
    if (nestedLink && nav.contains(nestedLink)) {
      const parentLi = nestedLink.parentElement;
      const submenu = this.getDirectSubmenu(nestedLink);
      if (!submenu) return;

      event.preventDefault();
      event.stopPropagation();

      const isOpen = submenu.classList.contains('tablet-active');
      const siblings = parentLi?.parentElement?.querySelectorAll(':scope > li > ul.tablet-active');

      siblings?.forEach((menu: Element) => {
        if (menu !== submenu) {
          this.renderer.removeClass(menu, 'tablet-active');
        }
      });

      if (isOpen) {
        this.renderer.removeClass(submenu, 'tablet-active');
      } else {
        this.renderer.addClass(submenu, 'tablet-active');
      }
    }
  }

}
