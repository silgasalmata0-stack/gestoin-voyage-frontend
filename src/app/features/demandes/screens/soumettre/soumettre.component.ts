import { Component, OnInit, inject, signal, computed, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DemandeService } from '../../services/demande.service';
import { DemandeVoyageRequest } from '../../models/demande.model';
import { environment } from '../../../../../environments/environment';

interface Universite {
  id:            number;
  nom:           string;
  ville:         string;
  paysNom:       string;
  regionId:      number | null;
  regionNom:     string | null;
  continentNom:  string | null;
  montantForfait: number | null;
  siteWeb:       string | null;
}

@Component({
  selector: 'app-soumettre',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './soumettre.component.html',
  styleUrl:    './soumettre.component.css',
})
export class SoumettreComponent implements OnInit {
  private demandeService = inject(DemandeService);
  private router         = inject(Router);
  private http           = inject(HttpClient);

  @ViewChild('searchInput') searchInputRef!: ElementRef<HTMLInputElement>;

  // Référence
  universites    = signal<Universite[]>([]);
  chargementRef  = signal(false);

  // Recherche
  rechercheTexte       = signal('');
  dropdownOuvert       = signal(false);
  universiteChoisie    = signal<Universite | null>(null);

  readonly resultatsRecherche = computed(() => {
    const q = this.rechercheTexte().toLowerCase().trim();
    if (!q || q.length < 2) return [];
    return this.universites()
      .filter(u =>
        u.nom.toLowerCase().includes(q) ||
        u.paysNom.toLowerCase().includes(q) ||
        u.ville.toLowerCase().includes(q) ||
        (u.continentNom?.toLowerCase().includes(q))
      )
      .slice(0, 8);
  });

  readonly totalUniversites = computed(() => this.universites().length);

  // Champs
  pays           = signal('');
  ville          = signal('');
  etablissement  = signal('');
  regionNomLibre = signal('');
  motif          = signal('');
  dateDepart     = signal('');
  dateRetour     = signal('');
  lettreUrl      = signal('');

  // État
  soumission  = signal(false);
  erreur      = signal('');
  succes      = signal(false);

  readonly todayStr = new Date().toISOString().split('T')[0];

  // demain min (@Future backend)
  readonly tomorrowStr = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  })();

  // Validation
  readonly formulaireValide = computed(() =>
    !!this.pays().trim() &&
    !!this.ville().trim() &&
    !!this.etablissement().trim() &&
    !!this.motif().trim() &&
    !!this.dateDepart() &&
    this.dateDepart() > this.todayStr &&
    !!this.dateRetour() &&
    this.dateRetour() > this.dateDepart()
  );

  ngOnInit(): void {
    this.chargementRef.set(true);
    this.http.get<Universite[]>(`${environment.apiUrl}/zones/universites`).subscribe({
      next:  u => { this.universites.set(u); this.chargementRef.set(false); },
      error: () => this.chargementRef.set(false),
    });
  }

  // Handlers recherche
  onRechercheInput(val: string): void {
    this.rechercheTexte.set(val);
    this.dropdownOuvert.set(val.length >= 2);
  }

  selectionnerUniversite(u: Universite): void {
    this.universiteChoisie.set(u);
    this.pays.set(u.paysNom);
    this.ville.set(u.ville);
    this.etablissement.set(u.nom);
    this.rechercheTexte.set('');
    this.dropdownOuvert.set(false);
  }

  effacerUniversite(): void {
    this.universiteChoisie.set(null);
    this.pays.set('');
    this.ville.set('');
    this.etablissement.set('');
    setTimeout(() => this.searchInputRef?.nativeElement.focus(), 50);
  }

  fermerDropdown(): void {
    setTimeout(() => this.dropdownOuvert.set(false), 150);
  }

  // Soumission
  soumettre(): void {
    if (!this.formulaireValide()) return;
    this.soumission.set(true);
    this.erreur.set('');

    const req: DemandeVoyageRequest = {
      pays:                 this.pays(),
      ville:                this.ville(),
      etablissementAccueil: this.etablissement(),
      motifVoyage:          this.motif(),
      dateDepart:           this.dateDepart(),
      dateRetour:           this.dateRetour(),
    };

    const u = this.universiteChoisie();
    if (u) {
      req.universitePartenaireId = u.id;
      if (u.regionId) req.regionId = u.regionId;
    } else if (this.regionNomLibre().trim()) {
      req.regionNomLibre = this.regionNomLibre().trim();
    }

    if (this.lettreUrl().trim()) {
      req.lettreInvitationUrl = this.lettreUrl().trim();
    }

    this.demandeService.soumettre(req).subscribe({
      next:  () => { this.soumission.set(false); this.succes.set(true); },
      error: (e) => {
        this.erreur.set(e?.error?.message ?? 'Erreur lors de la soumission.');
        this.soumission.set(false);
      },
    });
  }

  retourListe(): void {
    this.router.navigateByUrl('/admin/demandes/my');
  }
}
