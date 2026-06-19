import { ChangeDetectionStrategy, Component } from '@angular/core';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-not-found-page',
  standalone: true,
  imports: [EmptyStateComponent],
  template: `<app-empty-state icon="404" title="Pagina no encontrada" message="La ruta solicitada no existe." actionLabel="Volver al inicio" actionUrl="/"></app-empty-state>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotFoundPageComponent {}
