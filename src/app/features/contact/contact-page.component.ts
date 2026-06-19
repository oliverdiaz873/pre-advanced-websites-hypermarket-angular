import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [ReactiveFormsModule, BreadcrumbComponent],
  template: `
    <app-breadcrumb [items]="[{ label: 'Contacto' }]"></app-breadcrumb>
    <section class="contact-layout">
      <div class="copy">
        <h1>Contacto</h1>
        <p>Escribenos para soporte de compras, entregas o disponibilidad de productos.</p>
        <ul>
          <li>Servicio al cliente: 809-555-0101</li>
          <li>Email: soporte@hypermarket.local</li>
          <li>Horario: lunes a sabado, 8:00 a.m. - 8:00 p.m.</li>
        </ul>
      </div>
      <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
        <label>Nombre<input formControlName="name" autocomplete="name"></label>
        @if (form.controls.name.touched && form.controls.name.invalid) { <small>Ingresa tu nombre.</small> }
        <label>Email<input formControlName="email" autocomplete="email"></label>
        @if (form.controls.email.touched && form.controls.email.invalid) { <small>Ingresa un email valido.</small> }
        <label>Mensaje<textarea formControlName="message" rows="5"></textarea></label>
        @if (form.controls.message.touched && form.controls.message.invalid) { <small>El mensaje debe tener al menos 10 caracteres.</small> }
        <button type="submit">Enviar</button>
        @if (sent) { <p class="sent">Mensaje preparado correctamente.</p> }
      </form>
    </section>
  `,
  styles: [`
    :host { display: grid; gap: 1rem; }
    .contact-layout { display: grid; grid-template-columns: 0.9fr 1.1fr; gap: 1.5rem; align-items: start; }
    .copy, form { background: #fff; border: 1px solid #e5e7eb; border-radius: 0.5rem; padding: 1.5rem; }
    h1 { margin: 0 0 0.5rem; font-size: 2.25rem; letter-spacing: 0; }
    p, li { color: #4b5563; line-height: 1.6; }
    form { display: grid; gap: 0.85rem; }
    label { display: grid; gap: 0.35rem; font-weight: 800; color: #111827; }
    input, textarea { border: 1px solid #d1d5db; border-radius: 0.5rem; padding: 0.75rem; font: inherit; }
    small { color: #b91c1c; font-weight: 700; }
    button { min-height: 2.75rem; border: 0; border-radius: 0.5rem; background: #111827; color: #fff; font-weight: 900; cursor: pointer; }
    .sent { color: #047857; font-weight: 800; margin: 0; }
    @media (max-width: 760px) { .contact-layout { grid-template-columns: 1fr; } }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactPageComponent {
  private readonly fb = inject(FormBuilder);
  sent = false;
  readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required, Validators.minLength(10)]]
  });

  submit(): void {
    this.form.markAllAsTouched();
    this.sent = this.form.valid;
  }
}
