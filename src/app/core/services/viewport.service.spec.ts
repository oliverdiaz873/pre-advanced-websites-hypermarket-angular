import { TestBed } from '@angular/core/testing';
import { ViewportService } from './viewport.service';

function ensureMatchMediaExists() {
  if (typeof window.matchMedia !== 'function') {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  }
}

function mockMatchMedia(matches: Record<string, boolean>) {
  ensureMatchMediaExists();

  const listeners = new Map<string, (event: MediaQueryListEvent) => void>();

  vi.spyOn(window, 'matchMedia').mockImplementation((query: string) => ({
    matches: matches[query] ?? false,
    media: query,
    onchange: null,
    addEventListener: (type: string, listener: (event: MediaQueryListEvent) => void) => {
      listeners.set(query, listener);
    },
    removeEventListener: (type: string, listener: (event: MediaQueryListEvent) => void) => {
      listeners.delete(query);
    },
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  } as unknown as MediaQueryList));

  return {
    triggerChange: (query: string, matches: boolean) => {
      const listener = listeners.get(query);
      if (listener) {
        listener({ matches } as MediaQueryListEvent);
      }
    },
    getListenerCount: () => listeners.size,
  };
}

describe('ViewportService', () => {
  let service: ViewportService;

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('SSR safety (matchMedia not available)', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({ providers: [ViewportService] });
      service = TestBed.inject(ViewportService);
    });

    it('isMobile defaults to false', () => {
      expect(service.isMobile()).toBe(false);
    });

    it('viewportMode defaults to desktop', () => {
      expect(service.viewportMode()).toBe('desktop');
    });

    it('isBelow returns false for any breakpoint', () => {
      expect(service.isBelow(640)()).toBe(false);
      expect(service.isBelow(1400)()).toBe(false);
    });

    it('matches returns false for any query', () => {
      expect(service.matches('(max-width: 768px)')()).toBe(false);
    });
  });

  describe('in browser (matchMedia)', () => {
    const mobileQ = '(max-width: 768px)';
    const tabletQ = '(min-width: 768px) and (max-width: 1199px)';

    beforeEach(() => {
      TestBed.configureTestingModule({ providers: [ViewportService] });
      service = TestBed.inject(ViewportService);
    });

    it('isMobile is true when viewport <= 768px', () => {
      mockMatchMedia({ [mobileQ]: true });

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({ providers: [ViewportService] });
      service = TestBed.inject(ViewportService);

      expect(service.isMobile()).toBe(true);
    });

    it('isMobile is false when viewport > 768px', () => {
      mockMatchMedia({ [mobileQ]: false });

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({ providers: [ViewportService] });
      service = TestBed.inject(ViewportService);

      expect(service.isMobile()).toBe(false);
    });

    it('viewportMode is mobile when <= 768px', () => {
      mockMatchMedia({ [mobileQ]: true, [tabletQ]: false });

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({ providers: [ViewportService] });
      service = TestBed.inject(ViewportService);

      expect(service.viewportMode()).toBe('mobile');
    });

    it('viewportMode is tablet when 768-1199px', () => {
      mockMatchMedia({ [mobileQ]: false, [tabletQ]: true });

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({ providers: [ViewportService] });
      service = TestBed.inject(ViewportService);

      expect(service.viewportMode()).toBe('tablet');
    });

    it('viewportMode is desktop when >= 1200px', () => {
      mockMatchMedia({ [mobileQ]: false, [tabletQ]: false });

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({ providers: [ViewportService] });
      service = TestBed.inject(ViewportService);

      expect(service.viewportMode()).toBe('desktop');
    });

    it('isBelow with custom breakpoint (640px)', () => {
      const q = '(max-width: 640px)';
      mockMatchMedia({ [q]: true });

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({ providers: [ViewportService] });
      service = TestBed.inject(ViewportService);

      expect(service.isBelow(640)()).toBe(true);
    });

    it('matches handles arbitrary queries', () => {
      const q = '(min-width: 1024px)';
      mockMatchMedia({ [q]: true });

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({ providers: [ViewportService] });
      service = TestBed.inject(ViewportService);

      expect(service.matches(q)()).toBe(true);
    });

    it('repeated isBelow(768) returns the same signal (cache)', () => {
      mockMatchMedia({});

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({ providers: [ViewportService] });
      service = TestBed.inject(ViewportService);

      const a = service.isBelow(768);
      const b = service.isBelow(768);

      expect(a).toBe(b);
    });

    it('repeated matches() with same query returns cached signal', () => {
      mockMatchMedia({});

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({ providers: [ViewportService] });
      service = TestBed.inject(ViewportService);

      const q = '(max-width: 768px)';
      const a = service.matches(q);
      const b = service.matches(q);

      expect(a).toBe(b);
    });
  });
});
