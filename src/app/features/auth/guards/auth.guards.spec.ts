import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, type UrlTree } from '@angular/router';
import { signal, type WritableSignal } from '@angular/core';
import { firstValueFrom, type Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { requireAuthGuard, redirectIfAuthenticatedGuard } from './auth.guards';
import type { AuthStatus } from '../types/auth.interface';

type GuardResult = boolean | UrlTree;

describe('auth guards', () => {
  let status: WritableSignal<AuthStatus>;
  let authMock: { status: () => AuthStatus; initialize: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    status = signal<AuthStatus>('loading');
    authMock = { status: () => status(), initialize: vi.fn(() => Promise.resolve()) };

    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: AuthService, useValue: authMock }],
    });
  });

  describe('requireAuthGuard', () => {
    const gate = () =>
      TestBed.runInInjectionContext(() => requireAuthGuard({} as never, { url: '/account' } as never));

    it('allows authenticated users', () => {
      status.set('authenticated');
      expect(gate()).toBe(true);
    });

    it('redirects anonymous users to /login with the original URL as returnUrl', () => {
      status.set('anonymous');

      const result = gate() as UrlTree;
      const router = TestBed.inject(Router);
      expect(router.serializeUrl(result)).toBe('/login?returnUrl=%2Faccount');
      expect(result.queryParamMap.get('returnUrl')).toBe('/account');
    });

    it('waits while loading and allows when the session is restored', async () => {
      authMock.initialize.mockImplementation(() => {
        status.set('authenticated');
        return Promise.resolve();
      });

      const result = await firstValueFrom(gate() as Observable<GuardResult>);
      expect(authMock.initialize).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('waits while loading and redirects when the session cannot be restored', async () => {
      authMock.initialize.mockImplementation(() => {
        status.set('anonymous');
        return Promise.resolve();
      });

      const result = await firstValueFrom(gate() as Observable<GuardResult>);
      const router = TestBed.inject(Router);
      expect(router.serializeUrl(result as UrlTree)).toBe('/login?returnUrl=%2Faccount');
    });
  });

  describe('redirectIfAuthenticatedGuard', () => {
    const gate = () =>
      TestBed.runInInjectionContext(() => redirectIfAuthenticatedGuard({} as never, {} as never));

    it('redirects authenticated users to /account', () => {
      status.set('authenticated');

      const result = gate() as UrlTree;
      const router = TestBed.inject(Router);
      expect(router.serializeUrl(result)).toBe('/account');
    });

    it('allows anonymous users to reach the page', () => {
      status.set('anonymous');
      expect(gate()).toBe(true);
    });

    it('waits while loading and redirects when the session was restored', async () => {
      authMock.initialize.mockImplementation(() => {
        status.set('authenticated');
        return Promise.resolve();
      });

      const result = await firstValueFrom(gate() as Observable<GuardResult>);
      const router = TestBed.inject(Router);
      expect(router.serializeUrl(result as UrlTree)).toBe('/account');
    });
  });
});