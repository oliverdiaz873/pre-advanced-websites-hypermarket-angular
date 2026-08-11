import { HttpErrorResponse } from '@angular/common/http';
import { authErrorKey } from './auth-error.util';

describe('authErrorKey', () => {
  const withCode = (code: string): HttpErrorResponse =>
    new HttpErrorResponse({ status: 400, error: { code } });

  it('maps UNAUTHORIZED to invalid_credentials', () => {
    expect(authErrorKey(withCode('UNAUTHORIZED'))).toBe('auth.errors.invalid_credentials');
  });

  it('maps CONFLICT to email_exists', () => {
    expect(authErrorKey(withCode('CONFLICT'))).toBe('auth.errors.email_exists');
  });

  it('maps RATE_LIMITED to rate_limited', () => {
    expect(authErrorKey(withCode('RATE_LIMITED'))).toBe('auth.errors.rate_limited');
  });

  it('maps VALIDATION_ERROR to invalid_credentials', () => {
    expect(authErrorKey(withCode('VALIDATION_ERROR'))).toBe('auth.errors.invalid_credentials');
  });

  it('falls back to unknown for internal errors', () => {
    expect(authErrorKey(withCode('INTERNAL_ERROR'))).toBe('auth.errors.unknown');
  });

  it('falls back to unknown when the body has no code', () => {
    expect(authErrorKey(new HttpErrorResponse({ status: 500 }))).toBe('auth.errors.unknown');
  });
});