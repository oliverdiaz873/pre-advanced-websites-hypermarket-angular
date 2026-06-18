import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IconComponent } from '../icons/icons.component';

@Component({
  selector: 'app-drawer',
  standalone: true,
  imports: [IconComponent],
  template: `
    <div class="drawer-backdrop" [class.is-open]="isOpen" (click)="closeDrawer.emit()"></div>
    <aside class="drawer-panel" [class.is-open]="isOpen">
      <button class="drawer-close" (click)="closeDrawer.emit()">
        <app-icon name="close" className="w-5 h-5"></app-icon>
      </button>
      <ng-content></ng-content>
    </aside>
  `,
  styles: [`
    .drawer-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 40;
      opacity: 0;
      pointer-events: none;
      transition: opacity 300ms ease;
    }
    .drawer-backdrop.is-open {
      opacity: 1;
      pointer-events: auto;
    }

    .drawer-panel {
      position: fixed;
      top: 0;
      left: 0;
      height: 100%;
      width: 20rem;
      max-width: 85vw;
      background: #fff;
      z-index: 50;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      overflow-y: auto;
      transform: translateX(-100%);
      transition: transform 300ms ease;
    }
    .drawer-panel.is-open {
      transform: translateX(0);
    }

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
      color: #6b7280;
      cursor: pointer;
      transition: background 200ms ease, color 200ms ease;
    }
    .drawer-close:hover {
      background: #f3f4f6;
      color: #111827;
    }
  `]
})
export class DrawerComponent {
  @Input({ required: true }) isOpen = false;
  @Output() closeDrawer = new EventEmitter<void>();
}
