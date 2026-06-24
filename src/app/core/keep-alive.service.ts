import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

/**
 * Ping le backend toutes les 13 minutes pour éviter que Render (free tier)
 * n'endorme le serveur (timeout inactivité = 15 min).
 *
 * Appeler start() à l'ouverture de la page login, stop() après connexion.
 */
@Injectable({ providedIn: 'root' })
export class KeepAliveService {
  private http = inject(HttpClient);
  private timer: ReturnType<typeof setInterval> | null = null;

  /** Intervalle de ping : 13 min (< 15 min timeout Render) */
  private readonly INTERVAL_MS = 13 * 60 * 1000;

  /** URL de santé Spring Boot (ou toute route légère du backend) */
  private readonly pingUrl = environment.apiUrl.replace('/api', '/actuator/health');

  start(): void {
    if (this.timer) return; // déjà actif
    this.ping(); // ping immédiat au démarrage
    this.timer = setInterval(() => this.ping(), this.INTERVAL_MS);
  }

  stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  private ping(): void {
    this.http
      .get(this.pingUrl, { responseType: 'text' })
      .subscribe({ error: () => { /* silencieux — le but est juste de réveiller */ } });
  }
}
