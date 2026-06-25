import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'https://gestionvoyage.onrender.com/api';

  constructor(private http: HttpClient) {}

  // GET — Liste tous les utilisateurs
  getUtilisateurs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/utilisateurs`);
  }

  // GET — Récupérer les rôles disponibles
  getRoles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/roles`);
  }

  // POST — Créer un utilisateur avec roleId
  creerUtilisateur(utilisateur: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/utilisateurs`, utilisateur);
  }

  // DELETE — Supprimer un utilisateur
  supprimerUtilisateur(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/utilisateurs/${id}`);
  }
}