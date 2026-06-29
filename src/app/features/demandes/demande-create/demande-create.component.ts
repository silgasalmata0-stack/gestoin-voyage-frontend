import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { DemandeService } from '../../../services/demande.service';

@Component({
  selector: 'app-demande-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './demande-create.component.html',
  styleUrl: './demande-create.component.css'
})
export class DemandeCreateComponent implements OnInit {

  demandeForm: FormGroup;
  zones: any[] = [];
  loading = false;
  erreur = '';
  succes = '';
  etapeActuelle = 1;
  totalEtapes = 4;

  etapes = [
    { numero: 1, label: 'Destination' },
    { numero: 2, label: 'Financement' },
    { numero: 3, label: 'Documents' },
    { numero: 4, label: 'Confirmation' }
  ];

  constructor(
    private fb: FormBuilder,
    private demandeService: DemandeService,
    private router: Router
  ) {
    this.demandeForm = this.fb.group({
      zoneTarifId: ['', Validators.required],
      pays: ['', Validators.required],
      ville: ['', Validators.required],
      etablissementAccueil: ['', Validators.required],
      motifVoyage: ['', Validators.required],
      dateDepart: ['', Validators.required],
      dateRetour: ['', Validators.required],
      lettreInvitationUrl: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.chargerZones();
  }

  chargerZones(): void {
    this.demandeService.getZonesTarif().subscribe({
      next: (data) => {
        this.zones = data;
      },
      error: (err) => {
        console.error('Erreur zones :', err);
      }
    });
  }

  etapeSuivante(): void {
    if (this.etapeActuelle < this.totalEtapes) {
      this.etapeActuelle++;
    }
  }

  etapePrecedente(): void {
    if (this.etapeActuelle > 1) {
      this.etapeActuelle--;
    }
  }

  onSubmit(): void {
    if (this.demandeForm.invalid) {
      this.erreur = 'Veuillez remplir tous les champs obligatoires.';
      return;
    }
    this.loading = true;
    this.erreur = '';
    this.succes = '';

    const donnees = { ...this.demandeForm.value };

    this.demandeService.creerDemande(donnees).subscribe({
      next: () => {
        this.succes = 'Demande soumise avec succès !';
        this.loading = false;
        setTimeout(() => this.router.navigate(['/admin/demandes']), 1500);
      },
      error: (err) => {
        this.erreur = err.error?.message || 'Erreur serveur.';
        this.loading = false;
      }
    });
  }
}