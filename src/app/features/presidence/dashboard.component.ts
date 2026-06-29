import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-presidence-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  stats = {
    totalDemandes: 0,
    enAttente: 0,
    validees: 0,
    rejetees: 0
  };

  sessionActive: any = null;
  demandesAValider: any[] = [];
  loading = false;
  showFormSession = false;
  succes = '';
  erreur = '';

  sessionForm = {
    annee: new Date().getFullYear(),
    dateOuverture: '',
    dateCloture: '',
    budgetDisponible: 0,
    nombreVoyagesAutorises: 0
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.chargerDonnees();
  }

  chargerDonnees(): void {
    this.loading = true;
    this.http.get<any>('/api/sessions/active').subscribe({
      next: (data) => { this.sessionActive = data; },
      error: () => { this.sessionActive = null; }
    });
    this.http.get<any[]>('/api/demandes?statut=TRANSMISE').subscribe({
      next: (data) => {
        this.demandesAValider = data;
        this.stats.enAttente = data.length;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  ouvrirFormSession(): void { this.showFormSession = true; }
  fermerFormSession(): void { this.showFormSession = false; }

  ouvrirSession(): void {
    this.loading = true;
    this.http.post('/api/sessions', this.sessionForm).subscribe({
      next: (data) => {
        this.sessionActive = data;
        this.succes = 'Session ouverte avec succès !';
        this.showFormSession = false;
        this.loading = false;
      },
      error: (err: any) => {
        this.erreur = err.error?.message || 'Erreur lors de l\'ouverture.';
        this.loading = false;
      }
    });
  }

  validerDemande(id: number): void {
    this.http.patch(`/api/demandes/${id}/valider`, {}).subscribe({
      next: () => {
        this.succes = 'Demande validée !';
        this.chargerDonnees();
      },
      error: (err: any) => {
        this.erreur = err.error?.message || 'Erreur.';
      }
    });
  }

  rejeterDemande(id: number, motif: string): void {
    this.http.patch(`/api/demandes/${id}/rejeter`, { motif }).subscribe({
      next: () => {
        this.succes = 'Demande rejetée.';
        this.chargerDonnees();
      },
      error: (err: any) => {
        this.erreur = err.error?.message || 'Erreur.';
      }
    });
  }
}