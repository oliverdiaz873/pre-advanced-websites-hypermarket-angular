import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { IconComponent } from '../icons/icons.component';

@Component({
  selector: 'app-drawer',
  standalone: true,
  imports: [IconComponent],
  template: `
    <div class="drawer-backdrop" [class.is-open]="isOpen" (click)="closeDrawer.emit()" aria-hidden="true"></div>

    <aside class="drawer-panel drawer-panel--{{ position }}" [class.is-open]="isOpen">
      @if (title) {
        <div class="drawer__header">
          <h2 class="drawer__title">{{ title }}</h2>
          <button class="drawer__close" (click)="closeDrawer.emit()" aria-label="Cerrar panel">
            <app-icon name="close" className="w-5 h-5"></app-icon>
          </button>
        </div>
      } @else {
        <button class="drawer-close" (click)="closeDrawer.emit()">
          <app-icon name="close" className="w-5 h-5"></app-icon>
        </button>
      }

      <div class="drawer__content" [class.drawer__content--with-header]="!!title">
        <ng-content></ng-content>
      </div>
    </aside>
  `,
  styles: [`
    .drawer-backdrop {
      position: fixed;
      inset: 0;
      background-color: rgba(0, 0, 0, 0.4);
      backdrop-filter: blur(6px);
      z-index: 9998;
      opacity: 0;
      visibility: hidden;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .drawer-backdrop.is-open {
      opacity: 1;
      visibility: visible;
    }

    .drawer-panel {
      position: fixed;
      top: 0;
      bottom: 0;
      width: 85%;
      max-width: 360px;
      background-color: rgba(0, 0, 0, 0.95);
      z-index: 9999;
      display: flex;
      flex-direction: column;
      transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: -20px 0 50px rgba(0, 0, 0, 0.3);
      visibility: hidden;
    }

    .drawer-panel.is-open {
      visibility: visible;
    }

    .drawer-panel--left {
      left: 0;
      transform: translateX(-100%);
    }

    .drawer-panel--left.is-open {
      transform: translateX(0);
    }

    .drawer-panel--right {
      right: 0;
      transform: translateX(100%);
    }

    .drawer-panel--right.is-open {
      transform: translateX(0);
    }

    .drawer__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .drawer__title {
      font-size: 1.1rem;
      font-weight: 700;
      color: #ffffff;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin: 0;
    }

    .drawer__close {
      background: transparent;
      border: none;
      color: rgba(255, 255, 255, 0.6);
      cursor: pointer;
      padding: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: all 0.2s ease;
    }

    .drawer__close:hover {
      background-color: rgba(255, 255, 255, 0.1);
      color: white;
    }

    .drawer__content {
      flex: 1;
      overflow-y: auto;
      padding: 1.5rem;
    }

    .drawer__content--with-header {
      padding: 1.5rem;
    }

    /* Fallback close button for drawers without title (backward compat) */
    .drawer-close {
      position: absolute;
      top: 1rem;
      right: 1rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 2rem;
      height: 2rem;
      border-radius: 0.5rem;
      background: transparent;
      border: none;
      color: rgba(255, 255, 255, 0.6);
      cursor: pointer;
      transition: all 0.2s ease;
      z-index: 1;
    }

    .drawer-close:hover {
      background-color: rgba(255, 255, 255, 0.1);
      color: white;
    }

    /* Desktop: drawer never visible */
    @media (min-width: 1024px) {
      .drawer-panel,
      .drawer-backdrop {
        display: none !important;
      }
    }
  `]
})
export class DrawerComponent {
  @Input({ required: true }) isOpen = false;
  @Input() title = '';
  @Input() position: 'left' | 'right' = 'left';
  @Output() closeDrawer = new EventEmitter<void>();

  @HostListener('window:keydown.escape')
  handleEscape(): void {
    if (this.isOpen) {
      this.closeDrawer.emit();
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleTabTrap(event: KeyboardEvent): void {
    if (event.key === 'Tab' && this.isOpen) {
      // Basic focus trap: keep focus inside drawer when open
      event.preventDefault();
    }
  }
}
