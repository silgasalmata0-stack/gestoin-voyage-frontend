import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthRepository } from '../domain/auth.repository';

@Injectable({ providedIn: 'root' })
export class LogoutUseCase {
  private repo = inject(AuthRepository);

  execute(): Observable<void> {
    return this.repo.logout();
  }
}
