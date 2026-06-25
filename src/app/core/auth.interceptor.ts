import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenStorage } from '../features/auth/infrastructure/token.storage';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(TokenStorage).getAccessToken();

  // On prépare les headers
  const headers: { [key: string]: string } = {
    'Content-Type': 'application/json'
  };

  // Si le token existe, on l'ajoute
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // On clone la requête avec les headers combinés
  const authReq = req.clone({
    setHeaders: headers
  });

  return next(authReq);
};