import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LegalLayoutComponent } from './legal-layout.component';

@Component({
  selector: 'app-terms-page',
  standalone: true,
  imports: [LegalLayoutComponent],
  template: `
    <app-legal-layout title="Terminos y condiciones">
      <p>Estos terminos regulan el uso de Hypermarket Angular, su catalogo, carrito y servicios de contacto.</p>
      <h2>Compras</h2>
      <p>Los precios y disponibilidad pueden variar antes de confirmar una orden. El carrito conserva cantidades localmente para facilitar la experiencia.</p>
      <h2>Entregas</h2>
      <p>Las ventanas de entrega se coordinan despues de validar disponibilidad y datos de contacto.</p>
    </app-legal-layout>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TermsPageComponent {}
