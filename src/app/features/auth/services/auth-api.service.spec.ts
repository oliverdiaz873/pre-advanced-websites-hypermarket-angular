import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthApiService } from './auth-api.service';

describe('AuthApiService', () => {
  let service: AuthApiService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting()],
    });
    service = TestBed.inject(AuthApiService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('login POSTs credentials to /api/auth/login and unwraps the envelope', () => {
    let result: unknown;
    service.login({ email: 'a@b.com', password: 'secret' }).subscribe((r) => (result = r));

    const req = httpTesting.expectOne('/api/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'a@b.com', password: 'secret' });

    req.flush({ success: true, data: { token: 'token', user: { id: '1' } } });
    expect(result).toEqual({ token: 'token', user: { id: '1' } });
  });

  it('register POSTs name/email/password to /api/auth/register', () => {
    let result: unknown;
    service.register({ name: 'Ana', email: 'a@b.com', password: 'secret' }).subscribe((r) => (result = r));

    const req = httpTesting.expectOne('/api/auth/register');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ name: 'Ana', email: 'a@b.com', password: 'secret' });

    req.flush({ success: true, data: { id: '1', email: 'a@b.com' } });
    expect(result).toEqual({ id: '1', email: 'a@b.com' });
  });

  it('logout POSTs to /api/auth/logout and resolves to void', () => {
    let done = false;
    service.logout().subscribe(() => (done = true));

    const req = httpTesting.expectOne('/api/auth/logout');
    expect(req.request.method).toBe('POST');
    req.flush({ success: true, data: null });

    expect(done).toBe(true);
  });

  it('me GETs /api/auth/me and unwraps the envelope', () => {
    let result: unknown;
    service.me().subscribe((r) => (result = r));

    const req = httpTesting.expectOne('/api/auth/me');
    expect(req.request.method).toBe('GET');
    req.flush({ success: true, data: { id: '1', email: 'a@b.com' } });
    expect(result).toEqual({ id: '1', email: 'a@b.com' });
  });
});