import { Component } from '@angular/core';
import { getAssetUrl } from '@core/utils';

@Component({
  selector: 'app-about-us',
  standalone: true,
  template: `
    <section class="about-us-section w-[calc(100vw-40px)] max-w-full mx-auto mt-10 mb-6 md:mt-9 md:mb-10 bg-black text-white py-5 rounded-[20px] overflow-hidden">
      <div class="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-10 lg:gap-16 px-5 py-4 md:px-8">
        <img
          [src]="getAssetUrl('assets/images/categories/food-background.webp')"
          alt="Hipermercado online"
          class="w-[250px] md:w-[350px] lg:w-[450px] h-auto rounded-[15px] shrink-0"
          loading="lazy"
        />
        <div class="max-w-[600px] text-center md:text-left">
          <h2 class="text-2xl md:text-3xl font-semibold mb-4">Sobre Hypermarket</h2>
          <p class="text-base md:text-lg leading-relaxed">
            Somos un hipermercado online comprometido con ofrecerte la mejor experiencia de compra.
            Trabajamos con proveedores locales e internacionales para traerte alimentos frescos,
            tecnologia de punta, articulos para el hogar y mucho mas, todo en un solo lugar.
          </p>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .about-us-section {
      transform-origin: center center;
      transition: none !important;
    }
  `]
})
export class AboutUsComponent {
  protected readonly getAssetUrl = getAssetUrl;
}
