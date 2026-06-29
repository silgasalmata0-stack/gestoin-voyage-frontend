import { Injectable, inject } from '@angular/core';
import { TokenStorage } from '../features/auth/infrastructure/token.storage';

export const ROLES = {
  ADMIN:      'ROLE_ADMIN',
  PRESIDENCE: 'ROLE_PRESIDENCE',
  DRIPE:      'ROLE_DRIPE',
  FINANCIER:  'ROLE_FINANCIER',
  ENSEIGNANT: 'ROLE_ENSEIGNANT',
} as const;

@Injectable({ providedIn: 'root' })
export class RoleService {
  private storage = inject(TokenStorage);

  getRole(): string | null {
    return this.storage.getRole();
  }

  is(role: string): boolean {
    return this.getRole() === role;
  }

  isAdmin():      boolean { return this.is(ROLES.ADMIN); }
  isPresidence(): boolean { return this.is(ROLES.PRESIDENCE); }
  isDripe():      boolean { return this.is(ROLES.DRIPE); }
  isFinancier():  boolean { return this.is(ROLES.FINANCIER); }
  isEnseignant(): boolean { return this.is(ROLES.ENSEIGNANT); }

  hasAnyRole(...roles: string[]): boolean {
    const current = this.getRole();
    return !!current && roles.includes(current);
  }

  /** Route de départ selon le rôle après login */
  getHomeRoute(): string {
    switch (this.getRole()) {
      case ROLES.ADMIN:      return '/admin/users';
      case ROLES.PRESIDENCE: return '/admin/sessions';
      case ROLES.DRIPE:      return '/admin/demandes';
      case ROLES.FINANCIER:  return '/admin/budget/view';
      case ROLES.ENSEIGNANT: return '/admin/demandes/my';
      default:               return '/admin/demandes';
    }
  }
}
