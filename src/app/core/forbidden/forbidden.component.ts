import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { RoleService } from '../role.service';

@Component({
  selector: 'app-forbidden',
  standalone: true,
  template: `
    <div class="forbidden-page">
      <div class="forbidden-card">
        <div class="forbidden-icon">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/></svg>
        </div>
        <h1>Accès refusé</h1>
        <p>Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
        <button (click)="retour()">Retour à mon espace</button>
      </div>
    </div>
  `,
  styles: [`
    .forbidden-page {
      min-height: 100vh; display: flex; align-items: center;
      justify-content: center; background: #f8fafc;
    }
    .forbidden-card {
      text-align: center; padding: 48px 40px;
      background: #fff; border-radius: 16px;
      border: 1.5px solid #e2e8f0;
      box-shadow: 0 4px 24px rgba(0,0,0,0.06);
      max-width: 400px;
    }
    .forbidden-icon {
      width: 72px; height: 72px; border-radius: 50%;
      background: #fef2f2; margin: 0 auto 20px;
      display: flex; align-items: center; justify-content: center;
    }
    .forbidden-icon svg { width: 36px; height: 36px; color: #dc2626; }
    h1 { font-size: 22px; font-weight: 700; color: #1e293b; margin-bottom: 10px; }
    p  { font-size: 14px; color: #64748b; line-height: 1.6; margin-bottom: 28px; }
    button {
      padding: 12px 28px; background: #0D47A1; color: #fff;
      border: none; border-radius: 8px; font-size: 13px;
      font-weight: 600; cursor: pointer;
    }
    button:hover { background: #1565C0; }
  `]
})
export class ForbiddenComponent {
  private router      = inject(Router);
  private roleService = inject(RoleService);

  retour(): void {
    this.router.navigateByUrl(this.roleService.getHomeRoute());
  }
}
