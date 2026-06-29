import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  DemandeVoyage,
  DemandeVoyageRequest,
  InstruireRequest,
  RejeterRequest,
  PageResponse,
} from '../models/demande.model';

@Injectable({ providedIn: 'root' })
export class DemandeService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/demandes`;

  lister(page = 0, size = 20): Observable<PageResponse<DemandeVoyage>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<PageResponse<DemandeVoyage>>(this.base, { params });
  }

  trouver(id: number): Observable<DemandeVoyage> {
    return this.http.get<DemandeVoyage>(`${this.base}/${id}`);
  }

  soumettre(req: DemandeVoyageRequest): Observable<DemandeVoyage> {
    return this.http.post<DemandeVoyage>(this.base, req);
  }

  modifier(id: number, req: DemandeVoyageRequest): Observable<DemandeVoyage> {
    return this.http.put<DemandeVoyage>(`${this.base}/${id}`, req);
  }

  annuler(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  // DRIPE
  instruire(id: number, req: InstruireRequest): Observable<DemandeVoyage> {
    return this.http.put<DemandeVoyage>(`${this.base}/${id}/instruire`, req);
  }

  transmettre(id: number): Observable<DemandeVoyage> {
    return this.http.put<DemandeVoyage>(`${this.base}/${id}/transmettre`, {});
  }

  rejeter(id: number, req: RejeterRequest): Observable<DemandeVoyage> {
    return this.http.put<DemandeVoyage>(`${this.base}/${id}/rejeter`, req);
  }

  // Présidence
  valider(id: number): Observable<DemandeVoyage> {
    return this.http.put<DemandeVoyage>(`${this.base}/${id}/valider`, {});
  }
}
