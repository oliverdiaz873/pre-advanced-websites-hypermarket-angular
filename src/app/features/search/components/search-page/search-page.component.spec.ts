import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal, type WritableSignal } from '@angular/core';
import { ActivatedRoute, convertToParamMap, type ParamMap } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { SeoService } from '@core/services/seo.service';
import { SearchService } from '@features/search/services/search.service';
import type { ProductUI } from '@features/products/models/product-ui.interface';
import { SearchPageComponent } from './search-page.component';
import { OfferService } from '@features/offers';

describe('SearchPageComponent', () => {
  let fixture: ComponentFixture<SearchPageComponent>;
  let paramMap$: BehaviorSubject<ParamMap>;
  let executeMock: ReturnType<typeof vi.fn>;
  let searchService: {
    executeQuerySearch: ReturnType<typeof vi.fn>;
    searchQueryResults: WritableSignal<ProductUI[]>;
    searchQueryLoading: WritableSignal<boolean>;
    searchQueryError: WritableSignal<string | null>;
  };
  let seoService: { applySeo: ReturnType<typeof vi.fn>; absoluteUrl: (path: string) => string };

  const translateServiceStub = {
    instant: vi.fn((key: string) => key),
    // ngx-translate v18: TranslatePipe usa translate() que debe devolver una señal.
    translate: vi.fn((key: string) => () => key),
    get: vi.fn(() => of('')),
    stream: vi.fn(() => of('')),
    currentLang: 'es',
    language: 'es',
    defaultLang: 'es',
    onLangChange: { subscribe: vi.fn() },
    onTranslationChange: { subscribe: vi.fn() },
    onDefaultLangChange: { subscribe: vi.fn() },
    addLangs: vi.fn(),
    getLangs: vi.fn(() => ['es', 'en']),
    setDefaultLang: vi.fn(),
    use: vi.fn(),
    reloadLang: vi.fn(),
    resetLang: vi.fn(),
    getBrowserLang: vi.fn(() => 'es'),
    getBrowserCultureLang: vi.fn(() => 'es-ES'),
    setTranslation: vi.fn(),
    getTranslation: vi.fn(() => Promise.resolve({})),
  };

  const fakeProduct = (): ProductUI => ({
    id: 'p1',
    name: 'Coca Cola',
    description: '',
    url: '/product/p1',
    categoria: 'bebidas',
    precio: 100,
    precioTexto: 'Precio: $100',
    imagen: '',
    oldPrice: undefined,
    discountPercentage: undefined,
  });

  /** Solo las ejecuciones con un `q` no vacío (las que dispararían HTTP). */
  const fetchCalls = (): string[] =>
    executeMock.mock.calls
      .map((call) => call[0] as string)
      .filter((q) => Boolean(q?.trim()));

  async function flush(): Promise<void> {
    fixture.detectChanges();
    if (vi.isFakeTimers()) {
      await vi.advanceTimersByTimeAsync(0);
    } else {
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
  }

  beforeEach(() => {
    paramMap$ = new BehaviorSubject<ParamMap>(convertToParamMap({}));
    executeMock = vi.fn();
    searchService = {
      executeQuerySearch: executeMock,
      searchQueryResults: signal([] as ProductUI[]),
      searchQueryLoading: signal(false),
      searchQueryError: signal(null),
    };
    seoService = { applySeo: vi.fn(), absoluteUrl: (path: string) => path };

    TestBed.configureTestingModule({
      imports: [SearchPageComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { queryParamMap: paramMap$ } },
        { provide: TranslateService, useValue: translateServiceStub },
        { provide: SeoService, useValue: seoService },
        { provide: SearchService, useValue: searchService },
        {
          provide: OfferService,
          useValue: {
            offers: signal([] as ProductUI[]),
            offersLoading: signal(false),
            error: signal<string | null>(null),
            loadAll: vi.fn(),
          },
        },
      ],
    });
  });

  it('fetches exactly once for a new query and does NOT refetch when results change', async () => {
    vi.useFakeTimers();
    try {
      paramMap$.next(convertToParamMap({ q: 'coca' }));
      fixture = TestBed.createComponent(SearchPageComponent);
      await flush();

      expect(fetchCalls()).toEqual(['coca']);

      searchService.searchQueryResults.set([fakeProduct(), fakeProduct()]);
      await flush();
      expect(fetchCalls()).toEqual(['coca']);

      paramMap$.next(convertToParamMap({ q: 'pan' }));
      await flush();
      expect(fetchCalls()).toEqual(['coca', 'pan']);
    } finally {
      vi.useRealTimers();
    }
  });

  it('does not issue a fetch when the query is empty, regardless of results changes', async () => {
    fixture = TestBed.createComponent(SearchPageComponent);
    await flush();

    expect(fetchCalls()).toEqual([]);

    searchService.searchQueryResults.set([fakeProduct()]);
    await flush();
    expect(fetchCalls()).toEqual([]);
  });
});