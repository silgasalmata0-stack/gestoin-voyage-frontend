import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenStorage } from '../features/auth/infrastructure/token.storage';

export const authGuard: CanActivateFn = () => {
  const storage = inject(TokenStorage);
  const router  = inject(Router);
  return storage.isAuthenticated()
    ? true
    : router.createUrlTree(['/login']);
};
