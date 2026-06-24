import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthRepository } from '../domain/auth.repository';
import { AuthResult, LoginCredentials } from '../domain/auth-user.model';

@Injectable({ providedIn: 'root' })
export class LoginUseCase {
  private repo = inject(AuthRepository);

  execute(credentials: LoginCredentials): Observable<AuthResult> {
    return this.repo.login(credentials);
  }
}
