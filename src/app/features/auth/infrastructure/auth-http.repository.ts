import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { AuthRepository } from '../domain/auth.repository';
import { AuthResult, AuthTokens, AuthUser, LoginCredentials } from '../domain/auth-user.model';
import { TokenStorage } from './token.storage';

interface AuthApiResponse {
  accessToken: string;
  refreshToken: string;
  role: string;
  email: string;
  nom?: string;
  prenom?: string;
}

@Injectable()
export class AuthHttpRepository extends AuthRepository {
  private http    = inject(HttpClient);
  private storage = inject(TokenStorage);
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  login(credentials: LoginCredentials): Observable<AuthResult> {
    return this.http
      .post<AuthApiResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        map((res) => this.toAuthResult(res)),
        tap((result) => this.storage.store(result.tokens, result.user.role)),
      );
  }

  logout(): Observable<void> {
    return this.http
      .post<void>(`${this.apiUrl}/logout`, {})
      .pipe(tap(() => this.storage.clear()));
  }

  refreshToken(refreshToken: string): Observable<AuthTokens> {
    return this.http
      .post<{ accessToken: string; refreshToken?: string }>(
        `${this.apiUrl}/refresh`,
        { refreshToken },
      )
      .pipe(
        map((res) => ({
          accessToken:  res.accessToken,
          refreshToken: res.refreshToken ?? refreshToken,
        })),
        tap((tokens) => this.storage.store(tokens, this.storage.getRole() ?? '')),
      );
  }

  private toAuthResult(res: AuthApiResponse): AuthResult {
    const user: AuthUser    = { email: res.email, role: res.role, nom: res.nom, prenom: res.prenom };
    const tokens: AuthTokens = { accessToken: res.accessToken, refreshToken: res.refreshToken };
    return { user, tokens };
  }
}
