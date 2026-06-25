import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../admin/users/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // Ton URL base pour le proxy
  private apiUrl = '/api'; 

  constructor(private http: HttpClient) {}

  // Fonction utilitaire pour définir les entêtes JSON
  private getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  }

  // GET — Liste tous les utilisateurs
  getUtilisateurs(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/utilisateurs`);
  }

  // POST — Créer un utilisateur avec les options JSON
  creerUtilisateur(utilisateur: User): Observable<User> {
    return this.http.post<User>(
      `${this.apiUrl}/utilisateurs`, 
      JSON.stringify(utilisateur), // On s'assure que l'objet est bien en chaîne JSON
      this.getHttpOptions()
    );
  }
}