import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from '../services/auth.service';
import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  let http: HttpClient;
  let httpTesting: HttpTestingController;
  let auth: {
    authenticated: () => boolean;
    expireSession: ReturnType<typeof vi.fn>;
    notify: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    auth = { authenticated: () => false, expireSession: vi.fn(), notify: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: auth },
      ],
    });

    http = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('adds withCredentials to /api requests', () => {
    http.get('/api/products').subscribe();

    const req = httpTesting.expectOne('/api/products');
    expect(req.request.withCredentials).toBe(true);
    req.flush({ success: true, data: [] });
  });

  it('does not touch non-API requests', () => {
    http.get('/assets/i18n/es.json').subscribe();

    const req = httpTesting.expectOne('/assets/i18n/es.json');
    expect(req.request.withCredentials).toBe(false);
    req.flush({});
  });

  it('expires the session and notifies session_expired on 401 while authenticated (non-auth endpoint)', () => {
    auth.authenticated = () => true;

    http.get('/api/cart').subscribe({ error: () => undefined });
    const req = httpTesting.expectOne('/api/cart');
    req.flush({ code: 'UNAUTHORIZED' }, { status: 401, statusText: 'Unauthorized' });

    expect(auth.expireSession).toHaveBeenCalledTimes(1);
    expect(auth.notify).toHaveBeenCalledWith('session_expired');
  });

  it('does not handle 401 on /auth/login (error is shown inline)', () => {
    auth.authenticated = () => true;

    http.get('/api/auth/login').subscribe({ error: () => undefined });
    const req = httpTesting.expectOne('/api/auth/login');
    req.flush({ code: 'UNAUTHORIZED' }, { status: 401, statusText: 'Unauthorized' });

    expect(auth.expireSession).not.toHaveBeenCalled();
    expect(auth.notify).not.toHaveBeenCalled();
  });

  it('does not expire the session on 401 when already anonymous', () => {
    auth.authenticated = () => false;

    http.get('/api/products').subscribe({ error: () => undefined });
    const req = httpTesting.expectOne('/api/products');
    req.flush({ code: 'UNAUTHORIZED' }, { status: 401, statusText: 'Unauthorized' });

    expect(auth.expireSession).not.toHaveBeenCalled();
    expect(auth.notify).not.toHaveBeenCalled();
  });

  it('notifies rate_limited on 429 (rate limited)', () => {
    http.get('/api/products').subscribe({ error: () => undefined });
    const req = httpTesting.expectOne('/api/products');
    req.flush({ code: 'RATE_LIMITED' }, { status: 429, statusText: 'Too Many Requests' });

    expect(auth.notify).toHaveBeenCalledWith('rate_limited');
  });

  it('rethrows the error downstream', () => {
    let received: unknown;
    http.get('/api/products').subscribe({ error: (e) => (received = e) });

    const req = httpTesting.expectOne('/api/products');
    req.flush({ code: 'INTERNAL_ERROR' }, { status: 500, statusText: 'Internal Server Error' });

    expect(received).toBeInstanceOf(HttpErrorResponse);
  });
});