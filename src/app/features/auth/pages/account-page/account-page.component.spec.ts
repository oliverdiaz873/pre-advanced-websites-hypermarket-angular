import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { AccountPageComponent } from './account-page.component';
import type { AuthUser } from '../../types/auth.interface';

const user: AuthUser = {
  id: '1',
  name: 'Ana López',
  email: 'a@b.com',
  role: 'customer',
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-01T00:00:00.000Z',
};

describe('AccountPageComponent', () => {
  let component: AccountPageComponent;
  let authMock: { logout: ReturnType<typeof vi.fn> };
  const navigateByUrl = vi.fn();

  beforeEach(async () => {
    authMock = { logout: vi.fn() };
    navigateByUrl.mockReset();

    TestBed.configureTestingModule({
      imports: [AccountPageComponent],
      providers: [
        { provide: AuthService, useValue: { user: () => user, logout: authMock.logout } },
        { provide: Router, useValue: { navigateByUrl, createUrlTree: vi.fn(() => ({})), serializeUrl: vi.fn(() => '') } },
        { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: { get: () => null } }, url: of(null) } },
        { provide: TranslateService, useValue: { instant: (key: string): string => key, translate: (key: string) => () => key } },
      ],
    });

    await TestBed.compileComponents();
    component = TestBed.createComponent(AccountPageComponent).componentInstance;
  });

  it('renders the current user details', () => {
    const fixture = TestBed.createComponent(AccountPageComponent);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Ana');
    expect(text).toContain('a@b.com');
  });

  it('calls logout and navigates back home on success', () => {
    authMock.logout.mockReturnValue(of(undefined));

    component.logout();

    expect(authMock.logout).toHaveBeenCalledTimes(1);
    expect(navigateByUrl).toHaveBeenCalledWith('/');
  });

  it('ignores repeated clicks while logging out', () => {
    authMock.logout.mockReturnValue(of(undefined));

    component.logout();
    component.logout();

    expect(authMock.logout).toHaveBeenCalledTimes(1);
  });
});