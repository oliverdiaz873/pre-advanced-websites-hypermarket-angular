/**
 * Contrato de sesión del backend (B1). La cookie httpOnly la gestiona el
 * backend; Angular solo conoce la identidad a través de `GET /auth/me`.
 * El JWT nunca se expone en la UI ni se lee desde JavaScript.
 */

export type UserRole = 'customer' | 'admin';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest extends LoginRequest {
  name: string;
}

export interface AuthResults {
  token: string;
  user: AuthUser;
}

export type AuthStatus = 'loading' | 'authenticated' | 'anonymous';