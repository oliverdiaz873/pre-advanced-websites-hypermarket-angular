import { Component, DestroyRef, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { JsonLdSchema, SeoConfig } from '@core/types/seo';
import { SeoService } from '@core/services/seo.service';

const fallbackSeo: SeoConfig = {
  title: 'Hypermarket',
  description: 'Hipermercado online con alimentos, tecnologia, farmacia, ferreteria, moda y hogar en un solo carrito.',
  jsonLd: null,
  openGraph: {
    image: '/assets/images/logo/logo.png',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image'
  }
};

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet></router-outlet>',
  styleUrl: './app.scss'
})
export class App {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);
  private readonly translate = inject(TranslateService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly websiteSchema: JsonLdSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Hypermarket',
    description: 'Hipermercado online con alimentos, tecnologia, farmacia, ferreteria, moda y hogar.',
    url: this.seo.absoluteUrl('/'),
    potentialAction: {
      '@type': 'SearchAction',
      target: `${this.seo.absoluteUrl('/')}search?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  };

  private readonly organizationSchema: JsonLdSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Hypermarket',
    url: this.seo.absoluteUrl('/'),
    logo: this.seo.absoluteUrl('/assets/images/logo/logo.png'),
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service'
    }
  };

  constructor() {
    this.seo.setBaseJsonLd([this.websiteSchema, this.organizationSchema]);
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        const activeRoute = this.deepestChild(this.route);
        const routeSeo = activeRoute.snapshot.data['seo'] as SeoConfig | undefined;
        const seoConfig = routeSeo ?? fallbackSeo;

        this.seo.applySeo({
          ...seoConfig,
          canonicalPath: seoConfig.canonicalPath ?? this.router.url,
          openGraph: { ...fallbackSeo.openGraph, ...seoConfig.openGraph },
          twitter: { ...fallbackSeo.twitter, ...seoConfig.twitter }
        });
      });

    this.translate.onLangChange
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.seo.refreshSeo();
      });
  }

  private deepestChild(route: ActivatedRoute): ActivatedRoute {
    let activeRoute = route;

    while (activeRoute.firstChild) {
      activeRoute = activeRoute.firstChild;
    }

    return activeRoute;
  }
}
