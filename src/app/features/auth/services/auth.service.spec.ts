import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { PlatformService } from '@core/services/platform.service';
import { AuthApiService } from './auth-api.service';
import { AuthService } from './auth.service';
import type { AuthUser } from '../types/auth.interface';

const fakeUser: AuthUser = {
  id: '1',
  name: 'Ana López',
  email: 'a@b.com',
  role: 'customer',
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-01T00:00:00.000Z',
};

describe('AuthService', () => {
  let service: AuthService;
  let apiMock: {
    me: ReturnType<typeof vi.fn>;
    login: ReturnType<typeof vi.fn>;
    register: ReturnType<typeof vi.fn>;
    logout: ReturnType<typeof vi.fn>;
  };
  let platformMock: { isBrowser: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    apiMock = { me: vi.fn(), login: vi.fn(), register: vi.fn(), logout: vi.fn() };
    platformMock = { isBrowser: vi.fn(() => true) };

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: AuthApiService, useValue: apiMock },
        { provide: PlatformService, useValue: platformMock },
      ],
    });

    service = TestBed.inject(AuthService);
  });

  it('starts in loading state', () => {
    expect(service.status()).toBe('loading');
    expect(service.user()).toBeNull();
    expect(service.authenticated()).toBe(false);
  });

  describe('initialize()', () => {
    it('restores the session from /me and sets authenticated', async () => {
      apiMock.me.mockReturnValue(of(fakeUser));

      await service.initialize();

      expect(service.status()).toBe('authenticated');
      expect(service.user()).toEqual(fakeUser);
      expect(service.authenticated()).toBe(true);
    });

    it('is single-flight: does not call /me twice', async () => {
      apiMock.me.mockReturnValue(of(fakeUser));

      await service.initialize();
      await service.initialize();

      expect(apiMock.me).toHaveBeenCalledTimes(1);
    });

    it('sets anonymous when /me fails with 401', async () => {
      apiMock.me.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 401 })));

      await service.initialize();

      expect(service.status()).toBe('anonymous');
      expect(service.user()).toBeNull();
    });

    it('does nothing on the server (no /me call, keeps loading)', async () => {
      platformMock.isBrowser.mockReturnValue(false);

      await service.initialize();

      expect(apiMock.me).not.toHaveBeenCalled();
      expect(service.status()).toBe('loading');
    });

    it('does not re-fetch after a session was already resolved', async () => {
      apiMock.login.mockReturnValue(of({ token: 't', user: fakeUser }));
      service.login({ email: 'a@b.com', password: 'secret' }).subscribe();
      apiMock.me.mockClear();

      await service.initialize();

      expect(apiMock.me).not.toHaveBeenCalled();
      expect(service.status()).toBe('authenticated');
    });
  });

  describe('login', () => {
    it('stores the user and marks the session as authenticated', () => {
      apiMock.login.mockReturnValue(of({ token: 'jwt', user: fakeUser }));

      let loggedUser: AuthUser | undefined;
      service.login({ email: 'a@b.com', password: 'secret' }).subscribe((u) => (loggedUser = u));

      expect(loggedUser).toEqual(fakeUser);
      expect(service.status()).toBe('authenticated');
      expect(service.user()).toEqual(fakeUser);
    });

    it('keeps the previous state when credentials are invalid', () => {
      apiMock.login.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 401 })));

      service.login({ email: 'a@b.com', password: 'wrong' }).subscribe({ error: () => undefined });

      expect(service.status()).toBe('loading');
      expect(service.user()).toBeNull();
    });
  });

  describe('register (auto-login)', () => {
    it('registers and then logs in automatically', () => {
      apiMock.register.mockReturnValue(of(fakeUser));
      apiMock.login.mockReturnValue(of({ token: 'jwt', user: fakeUser }));

      let result: AuthUser | undefined;
      service.register({ name: 'Ana', email: 'a@b.com', password: 'secret' }).subscribe((u) => (result = u));

      expect(apiMock.register).toHaveBeenCalledWith({ name: 'Ana', email: 'a@b.com', password: 'secret' });
      expect(apiMock.login).toHaveBeenCalledWith({ email: 'a@b.com', password: 'secret' });
      expect(result).toEqual(fakeUser);
      expect(service.status()).toBe('authenticated');
    });
  });

  describe('logout', () => {
    it('clears the session on success', () => {
      apiMock.logout.mockReturnValue(of(undefined));

      service.logout().subscribe();

      expect(service.status()).toBe('anonymous');
      expect(service.user()).toBeNull();
    });

    it('does not clear the session when the API call fails', () => {
      apiMock.login.mockReturnValue(of({ token: 't', user: fakeUser }));
      service.login({ email: 'a@b.com', password: 'secret' }).subscribe();

      apiMock.logout.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 500 })));

      service.logout().subscribe({ error: () => undefined });

      expect(service.status()).toBe('authenticated');
    });
  });

  describe('expireSession', () => {
    it('marks the session as anonymous', () => {
      apiMock.login.mockReturnValue(of({ token: 't', user: fakeUser }));
      service.login({ email: 'a@b.com', password: 'secret' }).subscribe();

      service.expireSession();

      expect(service.status()).toBe('anonymous');
      expect(service.user()).toBeNull();
    });
  });

  it('computes initials from the user name', () => {
    apiMock.login.mockReturnValue(of({ token: 't', user: fakeUser }));
    service.login({ email: 'a@b.com', password: 'secret' }).subscribe();
    expect(service.initials()).toBe('AL');
  });
});