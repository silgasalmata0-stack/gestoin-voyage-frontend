import { Observable } from 'rxjs';
import { AuthResult, AuthTokens, LoginCredentials } from './auth-user.model';

/**
 * PORT — Contrat abstrait (classe abstraite = token DI Angular).
 * La couche domain/application ne connaît pas HttpClient ni localStorage.
 */
export abstract class AuthRepository {
  abstract login(credentials: LoginCredentials): Observable<AuthResult>;
  abstract logout(): Observable<void>;
  abstract refreshToken(token: string): Observable<AuthTokens>;
}
