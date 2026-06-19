import { Routes } from '@angular/router';
import { SeoConfig } from '@core/services/seo.service';
import { ShopLayoutComponent } from './layouts/shop-layout/shop-layout.component';

const seo = (config: SeoConfig) => config;

export const routes: Routes = [
  {
    path: '',
    component: ShopLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./features/home/home-page.component').then(m => m.HomePageComponent),
        data: {
          seo: seo({
            title: 'Hipermercado online',
            description: 'Compra alimentos, tecnologia, farmacia, ferreteria, moda y hogar en Hypermarket.',
            canonicalPath: '/',
            jsonLd: {
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Hypermarket',
              description: 'Hipermercado online con alimentos, tecnologia, farmacia, ferreteria, moda y hogar.',
              url: '/',
              potentialAction: {
                '@type': 'SearchAction',
                target: '/search?q={search_term_string}',
                'query-input': 'required name=search_term_string'
              }
            }
          })
        }
      },
      {
        path: 'category/:id',
        loadComponent: () => import('./features/category/category-page.component').then(m => m.CategoryPageComponent),
        data: {
          seo: seo({
            title: 'Categoria',
            description: 'Explora productos por categoria en Hypermarket.',
            jsonLd: null
          })
        }
      },
      {
        path: 'product/:id',
        loadComponent: () => import('./features/product/product-page.component').then(m => m.ProductPageComponent),
        data: {
          seo: seo({
            title: 'Producto',
            description: 'Consulta detalles, precio y disponibilidad de productos en Hypermarket.',
            jsonLd: null
          })
        }
      },
      {
        path: 'offers',
        loadComponent: () => import('./features/offers/offers-page.component').then(m => m.OffersPageComponent),
        data: {
          seo: seo({
            title: 'Ofertas',
            description: 'Encuentra productos con descuento activo en Hypermarket.',
            canonicalPath: '/offers',
            jsonLd: {
              '@context': 'https://schema.org',
              '@type': 'CollectionPage',
              name: 'Ofertas Hypermarket',
              description: 'Productos con descuento activo para comprar hoy.',
              url: '/offers'
            }
          })
        }
      },
      {
        path: 'contact',
        loadComponent: () => import('./features/contact/contact-page.component').then(m => m.ContactPageComponent),
        data: {
          seo: seo({
            title: 'Contacto',
            description: 'Contacta a Hypermarket para soporte de compras, entregas o disponibilidad de productos.',
            canonicalPath: '/contact',
            jsonLd: {
              '@context': 'https://schema.org',
              '@type': 'ContactPage',
              name: 'Contacto Hypermarket',
              description: 'Soporte de compras, entregas y disponibilidad de productos.',
              url: '/contact'
            }
          })
        }
      },
      {
        path: 'legal/terms',
        loadComponent: () => import('./features/legal/terms-page.component').then(m => m.TermsPageComponent),
        data: {
          seo: seo({
            title: 'Terminos y condiciones',
            description: 'Terminos que regulan el uso de Hypermarket Angular, su catalogo, carrito y servicios.',
            canonicalPath: '/legal/terms',
            jsonLd: {
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'Terminos y condiciones',
              url: '/legal/terms'
            }
          })
        }
      },
      {
        path: 'legal/privacy',
        loadComponent: () => import('./features/legal/privacy-page.component').then(m => m.PrivacyPageComponent),
        data: {
          seo: seo({
            title: 'Privacidad',
            description: 'Politica de privacidad de Hypermarket Angular para navegacion, carrito y contacto.',
            canonicalPath: '/legal/privacy',
            jsonLd: {
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'Privacidad',
              url: '/legal/privacy'
            }
          })
        }
      },
      {
        path: 'cart',
        loadComponent: () => import('./features/cart/components/cart-page/cart-page.component').then(m => m.CartPageComponent),
        data: {
          seo: seo({
            title: 'Carrito',
            description: 'Revisa los productos agregados a tu carrito de compras en Hypermarket.',
            canonicalPath: '/cart',
            jsonLd: null
          })
        }
      },
      {
        path: 'search',
        loadComponent: () => import('./features/search/components/search-page/search-page.component').then(m => m.SearchPageComponent),
        data: {
          seo: seo({
            title: 'Busqueda',
            description: 'Busca productos por nombre en el catalogo de Hypermarket.',
            canonicalPath: '/search',
            jsonLd: {
              '@context': 'https://schema.org',
              '@type': 'CollectionPage',
              name: 'Busqueda de productos',
              description: 'Resultados de busqueda del catalogo Hypermarket.',
              url: '/search'
            }
          })
        }
      },
      {
        path: '**',
        loadComponent: () => import('./features/not-found/not-found-page.component').then(m => m.NotFoundPageComponent),
        data: {
          seo: seo({
            title: 'Pagina no encontrada',
            description: 'La pagina solicitada no existe en Hypermarket.',
            jsonLd: null,
            robots: 'noindex, nofollow'
          })
        }
      }
    ]
  }
];
