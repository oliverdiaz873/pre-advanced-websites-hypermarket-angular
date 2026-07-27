import { Component, EventEmitter, HostListener, Input, Output, OnDestroy, OnChanges, SimpleChanges, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { IconComponent } from '../icons/icons.component';

@Component({
  selector: 'app-drawer',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './drawer.component.html',
  styleUrl: './drawer.component.scss'
})
/**
 * Drawer - Componente genérico de panel deslizable
 *
 * Implementa una Estrategia de Renderizado Responsivo:
 * En pantallas pequeñas (móviles/tablets) actúa como el contenedor principal para
 * componentes de filtrado o navegación, permitiendo una experiencia "App-like"
 * mientras libera espacio en la interfaz principal.
 *
 * Proporciona una interfaz lateral que se desliza sobre el contenido principal.
 * Incluye bloqueo de scroll del body y cierre al hacer clic fuera (backdrop).
 */
export class DrawerComponent implements OnDestroy, OnChanges {
  @Input({ required: true }) isOpen = false;
  @Input() title = '';
  @Input() position: 'left' | 'right' = 'right';
  @Output() closeDrawer = new EventEmitter<void>();

  private platformId = inject(PLATFORM_ID);
  private previousOverflow = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && isPlatformBrowser(this.platformId)) {
      this.handleScrollLock(changes['isOpen'].currentValue);
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = this.previousOverflow;
    }
  }

  @HostListener('window:keydown.escape')
  handleEscape(): void {
    if (this.isOpen) {
      this.closeDrawer.emit();
    }
  }

  private handleScrollLock(open: boolean): void {
    if (open) {
      this.previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = this.previousOverflow;
      this.previousOverflow = '';
    }
  }
}
