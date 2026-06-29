import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/presentation/login/login.component').then(
        (m) => m.LoginComponent,
      ),
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layout/components/main-layout/main-layout.component').then(
        (m) => m.MainLayoutComponent,
      ),
    children: [
      {
        path: 'users',
        loadComponent: () => 
          import('./admin/users/user-list/user-list').then((m) => m.UserList),
      },
      {
        path: 'users/create',
        loadComponent: () => 
          import('./admin/users/user-create/user-create').then((m) => m.UserCreate),
      },
      {
  path: 'demandes/create',
  loadComponent: () =>
    import('./features/demandes/demande-create/demande-create.component').then(
      (m) => m.DemandeCreateComponent
    ),
},

{
  path: '',
  loadComponent: () =>
    import('./features/dashboard/dashboard.component').then(
      (m) => m.DashboardComponent
    ),
},



      // Tu pourras ajouter d'autres routes ici plus tard
    ],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];