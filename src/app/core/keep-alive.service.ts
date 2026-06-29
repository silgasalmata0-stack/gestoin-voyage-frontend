import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class KeepAliveService {
  private http = inject(HttpClient);
  private timer: ReturnType<typeof setInterval> | null = null;

  private readonly INTERVAL_MS = 13 * 60 * 1000;

  private readonly pingUrl = environment.apiUrl.replace('/api', '/health');

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
      .subscribe({ error: () => {  } });
  }
}
