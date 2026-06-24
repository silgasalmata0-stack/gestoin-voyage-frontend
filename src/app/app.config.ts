import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './core/auth.interceptor';
// Clean Architecture : binding port → adaptateur
import { AuthRepository } from './features/auth/domain/auth.repository';
import { AuthHttpRepository } from './features/auth/infrastructure/auth-http.repository';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([authInterceptor])),
    // Injection du port (AuthRepository) vers l'adaptateur HTTP
    { provide: AuthRepository, useClass: AuthHttpRepository },
  ],
};
