import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Session } from '../models/session.model';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/sessions`;

  lister(): Observable<Session[]> {
    return this.http.get<Session[]>(this.base);
  }

  active(): Observable<Session> {
    return this.http.get<Session>(`${this.base}/active`);
  }

  ouvrir(annee: number, dateOuverture: string, communique?: File): Observable<Session> {
    const form = new FormData();
    form.append('donnees', new Blob(
      [JSON.stringify({ annee, dateOuverture })],
      { type: 'application/json' }
    ));
    if (communique) form.append('communique', communique);
    return this.http.post<Session>(this.base, form);
  }

  cloturer(id: number): Observable<Session> {
    return this.http.put<Session>(`${this.base}/${id}/cloturer`, {});
  }
}
