import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DemandeService {

  private apiUrl = '/api';

  constructor(private http: HttpClient) {}

  // GET — Récupérer les zones tarifaires
  getZonesTarif(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/zones-tarif`);
  }

  // POST — Créer une demande de voyage
  creerDemande(demande: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/demandes`, demande);
  }

  // GET — Liste des demandes
  getDemandes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/demandes`);
  }
}