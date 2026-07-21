import { Injectable, inject, Signal, signal, computed, DestroyRef } from '@angular/core';
import { toSignal, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { products } from '@data/products.data';
import { normalizarTexto, hasSearchQuery } from '@core/utils';

/**
 * Representa un producto en los resultados del typeahead del header.
 *
 * Contiene solo la información necesaria para renderizar el dropdown:
 * identificador, nombre visible (traducido) y ruta de la imagen.
 */
export interface HeaderSearchProduct {
  id: string;
  name: string;
  imagen: string;
}

/**
 * Servicio central de búsqueda del header y de la página de resultados.
 *
 * Responsabilidades:
 * - Gestionar el estado del typeahead del header (searchTerm, isSearchActive, searchResults)
 * - Ejecutar la navegación a /search y a /product/:id
 * - Sincronizar la señal query con el parámetro ?q= de la URL
 *
 * Características:
 * - Búsqueda bilingüe: busca simultáneamente en español e inglés
 * - Filtrado en tiempo real: los resultados se actualizan al escribir
 * - Normalización: ignora acentos, diéresis y mayúsculas
 * - Máximo 8 resultados en el typeahead
 * - Estado compartido mediante Signals
 * - Re-evaluación automática al cambiar de idioma
 *
 * Flujo de funcionamiento:
 *   1. El usuario escribe en el input → setSearchTerm() actualiza searchTerm
 *   2. El computed searchResults reacciona al cambio y filtra productos
 *   3. El usuario hace clic en un resultado → selectResult() limpia estado y navega
 *   4. El usuario pulsa Enter o el botón de enviar → submitSearch() decide:
 *      - Si el search está cerrado → lo abre (el componente se encarga del foco)
 *      - Si está abierto sin contenido → lo cierra
 *      - Si está abierto con contenido → navega a /search?q=...
 */
@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private translate = inject(TranslateService);
  private destroyRef = inject(DestroyRef);

  /**
   * Read-only signal derived from the current URL's ?q= param.
   * Automatically updates whenever the route changes.
   */
  public readonly query: Signal<string> = toSignal(
    this.activatedRoute.queryParamMap.pipe(
      map(params => params.get('q') ?? '')
    ),
    { initialValue: '' }
  );

  public readonly searchTerm = signal('');

  public readonly isSearchActive = signal(false);

  /**
   * Internal signal bumped on every language change so the computed
   * below re-evaluates when translations are swapped.
   */
  private readonly langVersion = signal(0);

  /**
   * Resultados filtrados en tiempo real para el dropdown del header.
   *
   * Es un computed que reacciona a searchTerm y al idioma activo.
   * - Normaliza el término y los nombres (minúsculas, sin acentos)
   * - Compara contra el nombre en español y su traducción al inglés
   * - Devuelve máximo 8 resultados
   */
  public readonly searchResults: Signal<HeaderSearchProduct[]> = computed(() => {
    this.langVersion();
    const term = this.searchTerm().trim();
    if (!term) return [];

    const normalizedTerm = normalizarTexto(term);

    return products
      .filter((product) => {
        const nombreEs = normalizarTexto(product.name);
        const key = `products.${product.id}.name`;
        const translated = this.translate.instant(key);
        const nombreEn =
          translated !== key ? normalizarTexto(translated) : nombreEs;

        return nombreEs.includes(normalizedTerm) || nombreEn.includes(normalizedTerm);
      })
      .map((product) => {
        const key = `products.${product.id}.name`;
        const translated = this.translate.instant(key);

        return {
          id: product.id,
          name: translated !== key ? translated : product.name,
          imagen: product.imagen
        };
      })
      .slice(0, 8);
  });

  /**
   * Suscripción a onLangChange para forzar el recálculo de searchResults
   * cuando el usuario cambia de idioma, ya que computed no detecta
   * automáticamente las llamadas a translate.instant().
   */
  constructor() {
    this.translate.onLangChange
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.langVersion.update((v) => v + 1));
  }

  public search(q: string): void {
    const trimmed = q.trim();
    if (trimmed) {
      this.router.navigate(['/search'], { queryParams: { q: trimmed } });
    }
  }

  public clear(): void {
    this.router.navigate(['/']);
  }

  public setSearchTerm(value: string): void {
    this.searchTerm.set(value);
  }

  public toggleSearch(): void {
    this.isSearchActive.update((current) => !current);
    if (!this.isSearchActive()) {
      this.searchTerm.set('');
    }
  }

  /**
   * Ejecuta la acción de búsqueda según el estado actual del typeahead.
   *
   * - Si el search está cerrado → solo lo activa (el componente se encarga del foco)
   * - Si está abierto pero vacío → lo cierra y limpia el término
   * - Si está abierto con contenido → navega a /search?q=... y limpia el estado
   */
  public submitSearch(): void {
    if (!this.isSearchActive()) {
      this.isSearchActive.set(true);
      return;
    }

    if (!hasSearchQuery(this.searchTerm())) {
      this.isSearchActive.set(false);
      this.searchTerm.set('');
      return;
    }

    const term = this.searchTerm().trim();

    this.router.navigate(['/search'], { queryParams: { q: term } });
    this.searchTerm.set('');
    this.isSearchActive.set(false);
  }

  /**
   * Navega al detalle del producto seleccionado.
   * Limpia el término de búsqueda y cierra el typeahead antes de navegar.
   */
  public selectResult(id: string): void {
    this.searchTerm.set('');
    this.isSearchActive.set(false);
    this.router.navigate(['/product', id]);
  }
}
