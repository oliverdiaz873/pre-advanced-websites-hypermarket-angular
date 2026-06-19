import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LegalLayoutComponent } from './legal-layout.component';

@Component({
  selector: 'app-privacy-page',
  standalone: true,
  imports: [LegalLayoutComponent],
  template: `
    <app-legal-layout title="Politica de privacidad">
      <p>Hypermarket Angular usa datos de navegacion y carrito solo para operar la experiencia de compra local.</p>
      <h2>Datos de contacto</h2>
      <p>Los datos enviados por el formulario se validan en la interfaz antes de ser procesados por servicios futuros.</p>
      <h2>Almacenamiento local</h2>
      <p>El carrito puede guardarse en el navegador para mantener cantidades entre sesiones.</p>
    </app-legal-layout>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrivacyPageComponent {}
