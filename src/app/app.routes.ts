import { Routes } from '@angular/router';
import { SeoConfig } from '@core/types/seo';
import { BRAND_NAME } from '@core/constants';
import { ShopLayoutComponent } from './layouts/shop-layout/shop-layout.component';

const seo = (config: SeoConfig) => config;

export const routes: Routes = [
  {
    path: '',
    component: ShopLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./features/home/pages/home-page/home-page.component').then(m => m.HomePageComponent),
        data: {
          seo: seo({
            titleKey: 'home.seo.title',
            descriptionKey: 'home.seo.description',
            canonicalPath: '/',
            jsonLd: null
          })
        }
      },
      {
        path: 'category/:id',
        loadComponent: () => import('./features/category/category-page.component').then(m => m.CategoryPageComponent),
        data: {
          seo: seo({
            jsonLd: null
          })
        }
      },
      {
        path: 'product/:id',
        loadComponent: () => import('./features/product/product-page.component').then(m => m.ProductPageComponent),
        data: {
          seo: seo({
            jsonLd: null
          })
        }
      },
      {
        path: 'offers',
        loadComponent: () => import('./features/offers/offers-page/offers-page.component').then(m => m.OffersPageComponent),
        data: {
          seo: seo({
            titleKey: 'offers.seo.title',
            descriptionKey: 'offers.seo.description',
            canonicalPath: '/offers',
            jsonLd: {
              '@context': 'https://schema.org',
              '@type': 'CollectionPage',
              name: `Ofertas - ${BRAND_NAME}`,
              description: 'Productos con descuento activo para comprar hoy.',
              url: '/offers'
            }
          })
        }
      },
      {
        path: 'contact',
        loadComponent: () => import('./features/contact/contact-page/contact-page.component').then(m => m.ContactPageComponent),
        data: {
          seo: seo({
            titleKey: 'contact.seo.title',
            descriptionKey: 'contact.seo.description',
            canonicalPath: '/contact',
            jsonLd: {
              '@context': 'https://schema.org',
              '@type': 'ContactPage',
              name: `Contacto - ${BRAND_NAME}`,
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
            titleKey: 'legal.terms.seo.title',
            descriptionKey: 'legal.terms.seo.description',
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
            titleKey: 'legal.privacy.seo.title',
            descriptionKey: 'legal.privacy.seo.description',
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
            titleKey: 'common.cart.seo.title',
            descriptionKey: 'common.cart.seo.description',
            canonicalPath: '/cart',
            jsonLd: null,
            robots: 'noindex, nofollow'
          })
        }
      },
      {
        path: 'search',
        loadComponent: () => import('./features/search/components/search-page/search-page.component').then(m => m.SearchPageComponent),
        data: {
          seo: seo({
            titleKey: 'search.seo.title_empty',
            descriptionKey: 'search.seo.desc_empty',
            canonicalPath: '/search',
            robots: 'noindex, nofollow',
            jsonLd: {
              '@context': 'https://schema.org',
              '@type': 'CollectionPage',
              name: 'Busqueda de productos',
              description: `Resultados de busqueda del catalogo de ${BRAND_NAME}.`,
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
            titleKey: 'notFound.seo.title',
            descriptionKey: 'notFound.seo.description',
            jsonLd: null,
            robots: 'noindex, nofollow'
          })
        }
      }
    ]
  }
];
