import { Injectable } from '@angular/core';
import { AuthTokens } from '../domain/auth-user.model';

@Injectable({ providedIn: 'root' })
export class TokenStorage {
  getAccessToken(): string | null  { return localStorage.getItem('accessToken'); }
  getRefreshToken(): string | null { return localStorage.getItem('refreshToken'); }
  getRole(): string | null         { return localStorage.getItem('role'); }

  store(tokens: AuthTokens, role: string): void {
    localStorage.setItem('accessToken',  tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
    localStorage.setItem('role', role);
  }

  clear(): void {
    ['accessToken', 'refreshToken', 'role'].forEach((k) => localStorage.removeItem(k));
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}
