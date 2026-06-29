import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { RoleService } from './role.service';

/**
 * Guard de route basé sur le rôle.
 * Usage : canActivate: [roleGuard('ROLE_ADMIN', 'ROLE_PRESIDENCE')]
 */
export function roleGuard(...allowedRoles: string[]): CanActivateFn {
  return () => {
    const roleService = inject(RoleService);
    const router      = inject(Router);

    if (!roleService.getRole()) {
      return router.createUrlTree(['/login']);
    }

    if (roleService.hasAnyRole(...allowedRoles)) {
      return true;
    }

    // Authentifié mais pas le bon rôle → page 403
    return router.createUrlTree(['/403']);
  };
}
