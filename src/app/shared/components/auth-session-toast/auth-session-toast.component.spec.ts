import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal, type WritableSignal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthNotice, AuthService } from '@features/auth/services/auth.service';
import { ToastService } from '../toast/toast.service';
import { AuthSessionToastComponent } from './auth-session-toast.component';

describe('AuthSessionToastComponent', () => {
  let notice: WritableSignal<AuthNotice | null>;
  let clearNotice: ReturnType<typeof vi.fn>;
  let warning: ReturnType<typeof vi.fn>;
  let fixture: ComponentFixture<AuthSessionToastComponent>;

  beforeEach(() => {
    notice = signal<AuthNotice | null>(null);
    clearNotice = vi.fn();
    warning = vi.fn();

    TestBed.configureTestingModule({
      imports: [AuthSessionToastComponent],
      providers: [
        { provide: AuthService, useValue: { notice: () => notice(), clearNotice } },
        { provide: ToastService, useValue: { warning } },
        { provide: TranslateService, useValue: { instant: (key: string): string => `T(${key})` } },
      ],
    });

    fixture = TestBed.createComponent(AuthSessionToastComponent);
    fixture.detectChanges();
  });

  it('does nothing while there is no notice', () => {
    expect(warning).not.toHaveBeenCalled();
    expect(clearNotice).not.toHaveBeenCalled();
  });

  it('shows the translated warning for session_expired and clears it', () => {
    notice.set('session_expired');
    fixture.detectChanges();

    expect(warning).toHaveBeenCalledWith('T(auth.errors.session_expired)');
    expect(clearNotice).toHaveBeenCalledTimes(1);
  });

  it('shows the translated warning for rate_limited and clears it', () => {
    notice.set('rate_limited');
    fixture.detectChanges();

    expect(warning).toHaveBeenCalledWith('T(auth.errors.rate_limited)');
    expect(clearNotice).toHaveBeenCalledTimes(1);
  });
});