import { Component, DestroyRef, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs/operators';
import { SeoConfig, SeoService } from '@core/services/seo.service';

const fallbackSeo: SeoConfig = {
  title: 'Hypermarket',
  description: 'Hipermercado online con alimentos, tecnologia, farmacia, ferreteria, moda y hogar en un solo carrito.',
  jsonLd: null
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
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
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
          canonicalPath: seoConfig.canonicalPath ?? this.router.url
        });
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
