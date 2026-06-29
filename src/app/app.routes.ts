import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';
import { roleGuard } from './core/role.guard';
import { ROLES } from './core/role.service';

const ADMIN      = ROLES.ADMIN;
const PRESIDENCE = ROLES.PRESIDENCE;
const DRIPE      = ROLES.DRIPE;
const FINANCIER  = ROLES.FINANCIER;
const ENSEIGNANT = ROLES.ENSEIGNANT;
const ALL        = [ADMIN, PRESIDENCE, DRIPE, FINANCIER, ENSEIGNANT];

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/presentation/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: '403',
    loadComponent: () =>
      import('./core/forbidden/forbidden.component').then(m => m.ForbiddenComponent),
  },

  // ── Zone principale ────────────────────────────────────
  {
    path: 'admin',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layout/components/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    children: [

      { path: '', redirectTo: 'demandes/my', pathMatch: 'full' },

      // ADMIN
      {
        path: 'users',
        canActivate: [roleGuard(ADMIN)],
        loadComponent: () =>
          import('./admin/users/user-list/user-list').then(m => m.UserList),
      },
      {
        path: 'users/create',
        canActivate: [roleGuard(ADMIN)],
        loadComponent: () =>
          import('./admin/users/user-create/user-create').then(m => m.UserCreate),
      },

      // PRESIDENCE + ADMIN
      {
        path: 'sessions',
        canActivate: [roleGuard(ADMIN, PRESIDENCE)],
        loadComponent: () =>
          import('./features/sessions/screens/presidence-dashboard/presidence-dashboard.component')
            .then(m => m.PresidenceDashboardComponent),
      },
      {
        path: 'sessions/open',
        canActivate: [roleGuard(ADMIN, PRESIDENCE)],
        loadComponent: () =>
          import('./features/sessions/screens/presidence-dashboard/presidence-dashboard.component')
            .then(m => m.PresidenceDashboardComponent),
      },
      {
        path: 'sessions/active',
        canActivate: [roleGuard(ADMIN, PRESIDENCE)],
        loadComponent: () =>
          import('./features/placeholder/placeholder.component').then(m => m.PlaceholderComponent),
        data: { title: 'Session active' },
      },
      {
        path: 'sessions/close',
        canActivate: [roleGuard(ADMIN, PRESIDENCE)],
        loadComponent: () =>
          import('./features/placeholder/placeholder.component').then(m => m.PlaceholderComponent),
        data: { title: 'Clôturer la session' },
      },

      // TOUS — Demandes
      {
        path: 'demandes',
        canActivate: [roleGuard(...ALL)],
        loadComponent: () =>
          import('./features/demandes/screens/demande-list/demande-list.component')
            .then(m => m.DemandeListComponent),
        data: { mode: 'all' },
      },
      {
        path: 'demandes/create',
        canActivate: [roleGuard(ENSEIGNANT, ADMIN)],
        loadComponent: () =>
          import('./features/demandes/screens/soumettre/soumettre.component')
            .then(m => m.SoumettreComponent),
      },
      {
        path: 'demandes/my',
        canActivate: [roleGuard(...ALL)],
        loadComponent: () =>
          import('./features/demandes/screens/demande-list/demande-list.component')
            .then(m => m.DemandeListComponent),
        data: { mode: 'my' },
      },

      // FINANCIER + ADMIN
      {
        path: 'budget/view',
        canActivate: [roleGuard(ADMIN, FINANCIER)],
        loadComponent: () =>
          import('./features/placeholder/placeholder.component').then(m => m.PlaceholderComponent),
        data: { title: 'Consulter le budget' },
      },
      {
        path: 'budget/init',
        canActivate: [roleGuard(ADMIN, FINANCIER)],
        loadComponent: () =>
          import('./features/placeholder/placeholder.component').then(m => m.PlaceholderComponent),
        data: { title: 'Initialiser le budget' },
      },
      {
        path: 'budget/acompte',
        canActivate: [roleGuard(ADMIN, FINANCIER)],
        loadComponent: () =>
          import('./features/placeholder/placeholder.component').then(m => m.PlaceholderComponent),
        data: { title: "Verser l'acompte" },
      },
      {
        path: 'budget/solde',
        canActivate: [roleGuard(ADMIN, FINANCIER)],
        loadComponent: () =>
          import('./features/placeholder/placeholder.component').then(m => m.PlaceholderComponent),
        data: { title: 'Verser le solde' },
      },
      {
        path: 'zones',
        canActivate: [roleGuard(ADMIN, FINANCIER)],
        loadComponent: () =>
          import('./features/placeholder/placeholder.component').then(m => m.PlaceholderComponent),
        data: { title: 'Zones & Tarifs' },
      },
      {
        path: 'zones/create',
        canActivate: [roleGuard(ADMIN, FINANCIER)],
        loadComponent: () =>
          import('./features/placeholder/placeholder.component').then(m => m.PlaceholderComponent),
        data: { title: 'Créer une zone' },
      },

      // ENSEIGNANT + FINANCIER + ADMIN
      {
        path: 'justificatifs',
        canActivate: [roleGuard(ADMIN, FINANCIER, ENSEIGNANT)],
        loadComponent: () =>
          import('./features/placeholder/placeholder.component').then(m => m.PlaceholderComponent),
        data: { title: 'Justificatifs' },
      },
      {
        path: 'justificatifs/upload',
        canActivate: [roleGuard(ADMIN, ENSEIGNANT)],
        loadComponent: () =>
          import('./features/placeholder/placeholder.component').then(m => m.PlaceholderComponent),
        data: { title: 'Déposer un justificatif' },
      },

      // ENSEIGNANT + DRIPE + ADMIN
      {
        path: 'reports/create',
        canActivate: [roleGuard(ADMIN, ENSEIGNANT)],
        loadComponent: () =>
          import('./features/placeholder/placeholder.component').then(m => m.PlaceholderComponent),
        data: { title: 'Demander un report' },
      },
      {
        path: 'reports/pending',
        canActivate: [roleGuard(ADMIN, DRIPE)],
        loadComponent: () =>
          import('./features/placeholder/placeholder.component').then(m => m.PlaceholderComponent),
        data: { title: 'Reports en attente' },
      },
      {
        path: 'reports/my',
        canActivate: [roleGuard(ADMIN, ENSEIGNANT)],
        loadComponent: () =>
          import('./features/placeholder/placeholder.component').then(m => m.PlaceholderComponent),
        data: { title: 'Mes reports' },
      },

      // TOUS
      {
        path: 'notifications/my',
        canActivate: [roleGuard(...ALL)],
        loadComponent: () =>
          import('./features/placeholder/placeholder.component').then(m => m.PlaceholderComponent),
        data: { title: 'Mes notifications' },
      },
      {
        path: 'notifications/read',
        canActivate: [roleGuard(...ALL)],
        loadComponent: () =>
          import('./features/placeholder/placeholder.component').then(m => m.PlaceholderComponent),
        data: { title: 'Notifications lues' },
      },

      // ADMIN
      {
        path: 'journal',
        canActivate: [roleGuard(ADMIN)],
        loadComponent: () =>
          import('./features/placeholder/placeholder.component').then(m => m.PlaceholderComponent),
        data: { title: "Journal d'activités" },
      },
      {
        path: 'journal/period',
        canActivate: [roleGuard(ADMIN)],
        loadComponent: () =>
          import('./features/placeholder/placeholder.component').then(m => m.PlaceholderComponent),
        data: { title: 'Journal par période' },
      },
      {
        path: 'journal/action',
        canActivate: [roleGuard(ADMIN)],
        loadComponent: () =>
          import('./features/placeholder/placeholder.component').then(m => m.PlaceholderComponent),
        data: { title: 'Journal par action' },
      },
    ],
  },

  { path: '**', redirectTo: 'login' },
];
