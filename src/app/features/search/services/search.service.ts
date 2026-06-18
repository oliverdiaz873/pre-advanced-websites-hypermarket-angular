import { Injectable, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';

/**
 * SearchService — URL is the single source of truth.
 *
 * The `query` signal is derived from the router query params, not stored
 * in-memory independently. This avoids desyncs between URL and state.
 */
@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

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

  /**
   * Navigate to /search with the provided query string.
   * This is the only way to mutate the search state.
   */
  public search(q: string): void {
    const trimmed = q.trim();
    if (trimmed) {
      this.router.navigate(['/search'], { queryParams: { q: trimmed } });
    }
  }

  /**
   * Clear the search query by navigating back to home.
   */
  public clear(): void {
    this.router.navigate(['/']);
  }
}
