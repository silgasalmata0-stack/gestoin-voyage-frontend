import { Component, OnInit, inject, signal, computed, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DemandeService } from '../../services/demande.service';
import { RoleService, ROLES } from '../../../../core/role.service';
import {
  DemandeVoyage, StatutDemande, STATUT_CONFIG, RejeterRequest
} from '../../models/demande.model';

@Component({
  selector: 'app-demande-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './demande-list.component.html',
  styleUrl:    './demande-list.component.css',
})
export class DemandeListComponent implements OnInit {

  @Input() mode: 'all' | 'my' = 'all'; // all = toutes, my = mes demandes

  private demandeService = inject(DemandeService);
  readonly roleService   = inject(RoleService);
  readonly ROLES         = ROLES;
  readonly STATUT_CONFIG = STATUT_CONFIG;

  demandes      = signal<DemandeVoyage[]>([]);
  loading       = signal(false);
  erreur        = signal('');
  page          = signal(0);
  totalPages    = signal(0);
  totalElements = signal(0);

  // Filtres locaux
  filtreStatut  = signal('');
  recherche     = signal('');

  // Dialog rejeter
  rejetDialog   = signal(false);
  rejetId       = signal<number | null>(null);
  motifRejet    = signal('');
  actionLoading = signal(false);

  // Dialog instruire (DRIPE)
  instruireDialog   = signal(false);
  instruireId       = signal<number | null>(null);
  observations      = signal('');

  readonly statutsOptions: StatutDemande[] = [
    'SOUMISE','EN_INSTRUCTION','TRANSMISE','VALIDEE','REJETEE','ANNULEE',
    'EN_ATTENTE_JUSTIFICATIFS','SOLDEE'
  ];

  readonly filtrees = computed(() => {
    const s = this.filtreStatut();
    const r = this.recherche().toLowerCase();
    return this.demandes().filter(d => {
      const matchStatut = !s || d.statut === s;
      const matchRecherche = !r ||
        d.reference.toLowerCase().includes(r) ||
        d.enseignantNom.toLowerCase().includes(r) ||
        d.pays.toLowerCase().includes(r) ||
        d.ville.toLowerCase().includes(r);
      return matchStatut && matchRecherche;
    });
  });

  ngOnInit(): void { this.charger(); }

  charger(p = 0): void {
    this.loading.set(true);
    this.erreur.set('');
    this.demandeService.lister(p).subscribe({
      next: res => {
        this.demandes.set(res.content);
        this.page.set(res.page);
        this.totalPages.set(res.totalPages);
        this.totalElements.set(res.totalElements);
        this.loading.set(false);
      },
      error: () => {
        this.erreur.set('Erreur lors du chargement des demandes.');
        this.loading.set(false);
      }
    });
  }

  pagePrecedente(): void { if (this.page() > 0) this.charger(this.page() - 1); }
  pageSuivante():   void { if (this.page() < this.totalPages() - 1) this.charger(this.page() + 1); }

  statutLabel(s: StatutDemande): string { return STATUT_CONFIG[s]?.label ?? s; }
  statutCss(s: StatutDemande):   string { return STATUT_CONFIG[s]?.css ?? ''; }

  annuler(d: DemandeVoyage): void {
    if (!confirm(`Annuler la demande ${d.reference} ?`)) return;
    this.actionLoading.set(true);
    this.demandeService.annuler(d.id).subscribe({
      next:  () => { this.actionLoading.set(false); this.charger(this.page()); },
      error: () => this.actionLoading.set(false),
    });
  }

  ouvrirInstruire(d: DemandeVoyage): void {
    this.instruireId.set(d.id);
    this.observations.set('');
    this.instruireDialog.set(true);
  }
  confirmerInstruire(): void {
    const id = this.instruireId();
    if (!id) return;
    this.actionLoading.set(true);
    this.demandeService.instruire(id, { observations: this.observations() || undefined }).subscribe({
      next:  () => { this.actionLoading.set(false); this.instruireDialog.set(false); this.charger(this.page()); },
      error: () => this.actionLoading.set(false),
    });
  }

  transmettre(d: DemandeVoyage): void {
    if (!confirm(`Transmettre la demande ${d.reference} à la Présidence ?`)) return;
    this.actionLoading.set(true);
    this.demandeService.transmettre(d.id).subscribe({
      next:  () => { this.actionLoading.set(false); this.charger(this.page()); },
      error: () => this.actionLoading.set(false),
    });
  }

  ouvrirRejet(d: DemandeVoyage): void {
    this.rejetId.set(d.id);
    this.motifRejet.set('');
    this.rejetDialog.set(true);
  }
  confirmerRejet(): void {
    const id = this.rejetId();
    if (!id || !this.motifRejet().trim()) return;
    this.actionLoading.set(true);
    this.demandeService.rejeter(id, { motifRejet: this.motifRejet() }).subscribe({
      next:  () => { this.actionLoading.set(false); this.rejetDialog.set(false); this.charger(this.page()); },
      error: () => this.actionLoading.set(false),
    });
  }

  valider(d: DemandeVoyage): void {
    if (!confirm(`Valider la demande ${d.reference} ?`)) return;
    this.actionLoading.set(true);
    this.demandeService.valider(d.id).subscribe({
      next:  () => { this.actionLoading.set(false); this.charger(this.page()); },
      error: () => this.actionLoading.set(false),
    });
  }

  // Visibilité actions
  peutInstruire(d: DemandeVoyage):   boolean { return this.roleService.isDripe() && d.statut === 'SOUMISE'; }
  peutTransmettre(d: DemandeVoyage): boolean { return this.roleService.isDripe() && d.statut === 'EN_INSTRUCTION'; }
  peutRejeterDripe(d: DemandeVoyage): boolean { return this.roleService.isDripe() && ['SOUMISE','EN_INSTRUCTION'].includes(d.statut); }
  peutValider(d: DemandeVoyage):     boolean { return this.roleService.isPresidence() && d.statut === 'TRANSMISE'; }
  peutRejeterPresidence(d: DemandeVoyage): boolean { return this.roleService.isPresidence() && d.statut === 'TRANSMISE'; }
  peutAnnuler(d: DemandeVoyage):     boolean { return this.roleService.isEnseignant() && ['BROUILLON','SOUMISE'].includes(d.statut); }
}
