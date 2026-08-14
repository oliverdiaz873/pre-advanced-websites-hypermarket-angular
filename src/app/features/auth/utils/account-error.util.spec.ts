import { HttpErrorResponse } from '@angular/common/http';
import { accountErrorKey } from './account-error.util';

describe('accountErrorKey', () => {
  it('maps VALIDATION_ERROR to update_failed', () => {
    const error = new HttpErrorResponse({
      status: 400,
      error: { code: 'VALIDATION_ERROR', message: 'Name must be a non-empty string' },
    });
    expect(accountErrorKey(error)).toBe('auth.errors.update_failed');
  });

  it('maps NOT_FOUND to update_failed', () => {
    const error = new HttpErrorResponse({ status: 404, error: { code: 'NOT_FOUND' } });
    expect(accountErrorKey(error)).toBe('auth.errors.update_failed');
  });

  it('maps UNAUTHORIZED to session_expired', () => {
    const error = new HttpErrorResponse({ status: 401, error: { code: 'UNAUTHORIZED' } });
    expect(accountErrorKey(error)).toBe('auth.errors.session_expired');
  });

  it('maps RATE_LIMITED to rate_limited', () => {
    const error = new HttpErrorResponse({ status: 429, error: { code: 'RATE_LIMITED' } });
    expect(accountErrorKey(error)).toBe('auth.errors.rate_limited');
  });

  it('falls back to unknown for INTERNAL_ERROR and missing body', () => {
    expect(accountErrorKey(new HttpErrorResponse({ status: 500, error: { code: 'INTERNAL_ERROR' } }))).toBe(
      'auth.errors.unknown',
    );
    expect(accountErrorKey(new HttpErrorResponse({ status: 0 }))).toBe('auth.errors.unknown');
  });
});
