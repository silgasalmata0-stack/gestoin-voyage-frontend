import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface UserCreatePayload {
  matricule: string;
  nom: string;
  prenom: string;
  email: string;
  motDePasse: string;
  role: number | string;
  specialite?: string;
  grade?: string;
  departement?: string;
  faculte?: string;
  fonction?: string;
  service?: string;
  titre?: string;
  niveauAcces?: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/utilisateurs`;
  private readonly rolesUrl = `${environment.apiUrl}/roles`;

  getUtilisateurs(): Observable<any[]> {
    return this.http.get<any[]>(this.base);
  }

  // ← Méthode ajoutée
  getRoles(): Observable<any[]> {
    return this.http.get<any[]>(this.rolesUrl);
  }

  creerUtilisateur(payload: UserCreatePayload): Observable<any> {
    return this.http.post<any>(this.base, payload);
  }

  supprimerUtilisateur(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}