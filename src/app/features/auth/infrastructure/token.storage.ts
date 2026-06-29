import { Injectable } from '@angular/core';
import { AuthTokens } from '../domain/auth-user.model';

@Injectable({ providedIn: 'root' })
export class TokenStorage {
  getAccessToken(): string | null  { return localStorage.getItem('accessToken'); }
  getRefreshToken(): string | null { return localStorage.getItem('refreshToken'); }
  getRole(): string | null         { return localStorage.getItem('role'); }
  getNom(): string | null          { return localStorage.getItem('nom'); }
  getPrenom(): string | null       { return localStorage.getItem('prenom'); }

  store(tokens: AuthTokens, role: string, nom?: string, prenom?: string): void {
    localStorage.setItem('accessToken',  tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
    localStorage.setItem('role', role);
    if (nom)    localStorage.setItem('nom',    nom);
    if (prenom) localStorage.setItem('prenom', prenom);
  }

  clear(): void {
    ['accessToken', 'refreshToken', 'role', 'nom', 'prenom']
      .forEach(k => localStorage.removeItem(k));
  }

  isAuthenticated(): boolean { return !!this.getAccessToken(); }
}
