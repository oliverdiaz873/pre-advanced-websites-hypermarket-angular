import { Component } from '@angular/core';
import { CategoryBannerComponent, CategoryBannerData } from '../category-banner/category-banner.component';

const CATEGORY_DATA: CategoryBannerData[] = [
  {
    id: 'alimentos',
    title: 'Alimentos y Despensa',
    description: 'Frutas frescas, verduras, lacteos, carnes, panaderia y productos de despensa con la mejor calidad.',
    buttonText: 'Ver alimentos',
    href: '/category/alimentos',
    imageSrc: 'assets/images/categories/food.png',
    gradientFrom: '#f97316',
    gradientTo: '#ea580c',
    accentColor: '#f97316'
  },
  {
    id: 'electrodomesticos',
    title: 'Electrodomesticos',
    description: 'Lavadoras, refrigeradores, hornos y aires acondicionados con la mejor relacion calidad-precio.',
    buttonText: 'Ver electrodomesticos',
    href: '/category/electrodomesticos',
    imageSrc: 'assets/images/categories/appliances.png',
    gradientFrom: '#2563eb',
    gradientTo: '#1d4ed8',
    accentColor: '#3b82f6'
  },
  {
    id: 'tecnologia',
    title: 'Tecnologia',
    description: 'Celulares, laptops, televisores, tablets y accesorios de las marcas mas innovadoras.',
    buttonText: 'Ver tecnologia',
    href: '/category/tecnologia',
    imageSrc: 'assets/images/categories/technology.png',
    gradientFrom: '#f97316',
    gradientTo: '#d97706',
    accentColor: '#f97316'
  },
  {
    id: 'ropa',
    title: 'Ropa y Accesorios',
    description: 'Moda para toda la familia: ropa casual, formal, deportiva y accesorios de temporada.',
    buttonText: 'Ver ropa',
    href: '/category/ropa',
    imageSrc: 'assets/images/categories/clothing.png',
    gradientFrom: '#ec4899',
    gradientTo: '#db2777',
    accentColor: '#ec4899'
  },
  {
    id: 'muebles',
    title: 'Muebles y Decoracion',
    description: 'Sofas, mesas, sillas, estanterias y decoracion para transformar tu hogar.',
    buttonText: 'Ver muebles',
    href: '/category/muebles-y-decoracion',
    imageSrc: 'assets/images/categories/furniture-and-decor.png',
    gradientFrom: '#78716c',
    gradientTo: '#57534e',
    accentColor: '#a8a29e'
  },
  {
    id: 'farmacia',
    title: 'Farmacia y Salud',
    description: 'Medicamentos, vitaminas, cuidado personal y primeros auxilios para tu bienestar.',
    buttonText: 'Ver farmacia',
    href: '/category/farmacia',
    imageSrc: 'assets/images/categories/pharmacy.png',
    gradientFrom: '#16a34a',
    gradientTo: '#15803d',
    accentColor: '#22c55e'
  },
  {
    id: 'ferreteria',
    title: 'Ferreteria',
    description: 'Herramientas, materiales de construccion, pintura y suministros para el hogar.',
    buttonText: 'Ver ferreteria',
    href: '/category/ferreteria',
    imageSrc: 'assets/images/categories/hardware-store.png',
    gradientFrom: '#6b7280',
    gradientTo: '#4b5563',
    accentColor: '#9ca3af'
  },
  {
    id: 'juguetes',
    title: 'Juguetes',
    description: 'Juguetes educativos, juegos de mesa, munecos y entretenimiento para los mas pequenos.',
    buttonText: 'Ver juguetes',
    href: '/category/juguetes',
    imageSrc: 'assets/images/categories/toys.png',
    gradientFrom: '#f59e0b',
    gradientTo: '#d97706',
    accentColor: '#fbbf24'
  }
];

@Component({
  selector: 'app-category-banners-section',
  standalone: true,
  imports: [CategoryBannerComponent],
  template: `
    <section id="category-banners" class="w-full max-w-[1400px] mx-auto px-4 md:px-8 pt-6 pb-4 md:pt-10 md:pb-6">
      <div class="text-center mb-8 md:mb-12">
        <h2 class="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
          Categorias destacadas
        </h2>
        <p class="mt-3 text-base md:text-lg text-gray-500 max-w-xl mx-auto">
          Explora productos organizados por categoria y encuentra todo lo que necesitas en un solo lugar.
        </p>
      </div>

      <div class="flex flex-col gap-6 md:gap-8">
        @for (cat of categories; track cat.id; let i = $index) {
          <app-category-banner [data]="cat" [reversed]="i % 2 !== 0"></app-category-banner>
        }
      </div>
    </section>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class CategoryBannersSectionComponent {
  protected readonly categories = CATEGORY_DATA;
}
