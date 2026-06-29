import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SessionService } from '../../services/session.service';
import { DemandeService } from '../../../demandes/services/demande.service';
import { Session } from '../../models/session.model';
import { DemandeVoyage, StatutDemande, STATUT_CONFIG } from '../../../demandes/models/demande.model';
import { RoleService } from '../../../../core/role.service';

type Onglet = 'validation' | 'sessions';

@Component({
  selector: 'app-presidence-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './presidence-dashboard.component.html',
  styleUrl:    './presidence-dashboard.component.css',
})
export class PresidenceDashboardComponent implements OnInit {
  private sessionService = inject(SessionService);
  private demandeService = inject(DemandeService);
  readonly roleService   = inject(RoleService);

  // Données
  sessions     = signal<Session[]>([]);
  sessionActive = signal<Session | null>(null);
  demandes     = signal<DemandeVoyage[]>([]);

  // UI
  onglet       = signal<Onglet>('validation');
  loading      = signal(false);
  erreur       = signal('');

  // Formulaire ouvrir session
  formOuvert   = signal(false);
  anneeForm    = signal(new Date().getFullYear());
  dateForm     = signal(new Date().toISOString().split('T')[0]);
  fichier      = signal<File | null>(null);
  nomFichier   = signal('');
  envoiSession = signal(false);
  erreurSession = signal('');

  // Panneau détail demande
  demandeDetail  = signal<DemandeVoyage | null>(null);
  rejetDialog    = signal(false);
  motifRejet     = signal('');
  actionLoading  = signal(false);

  readonly demandesTransmises = computed(() =>
    this.demandes().filter(d => d.statut === 'TRANSMISE')
  );
  readonly demandesValidees = computed(() =>
    this.demandes().filter(d => d.statut === 'VALIDEE').length
  );
  readonly demandesRejetees = computed(() =>
    this.demandes().filter(d => d.statut === 'REJETEE').length
  );

  readonly anneeActuelle = new Date().getFullYear();

  ngOnInit(): void { this.charger(); }

  charger(): void {
    this.loading.set(true);
    // Sessions
    this.sessionService.lister().subscribe({
      next: s => {
        this.sessions.set(s);
        this.sessionActive.set(s.find(x => x.statut === 'OUVERTE') ?? null);
      },
      error: () => {},
    });
    // Demandes
    this.demandeService.lister(0, 100).subscribe({
      next: r => { this.demandes.set(r.content); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  // Fichier communiqué
  onFichier(ev: Event): void {
    const f = (ev.target as HTMLInputElement).files?.[0] ?? null;
    this.fichier.set(f);
    this.nomFichier.set(f?.name ?? '');
  }

  ouvrirSession(): void {
    if (!this.anneeForm() || !this.dateForm()) return;
    this.envoiSession.set(true);
    this.erreurSession.set('');
    this.sessionService.ouvrir(this.anneeForm(), this.dateForm(), this.fichier() ?? undefined).subscribe({
      next: s => {
        this.sessionActive.set(s);
        this.sessions.update(list => [s, ...list]);
        this.formOuvert.set(false);
        this.envoiSession.set(false);
        this.fichier.set(null);
        this.nomFichier.set('');
      },
      error: e => {
        this.erreurSession.set(e?.error?.message ?? "Erreur lors de l'ouverture.");
        this.envoiSession.set(false);
      },
    });
  }

  cloturer(): void {
    const s = this.sessionActive();
    if (!s || !confirm(`Clôturer la session ${s.annee} ?`)) return;
    this.sessionService.cloturer(s.id).subscribe({
      next: updated => {
        this.sessionActive.set(null);
        this.sessions.update(list => list.map(x => x.id === updated.id ? updated : x));
      },
      error: () => {},
    });
  }

  // Validation demande
  ouvrirDetail(d: DemandeVoyage): void { this.demandeDetail.set(d); }
  fermerDetail(): void { this.demandeDetail.set(null); this.rejetDialog.set(false); }

  valider(d: DemandeVoyage): void {
    this.actionLoading.set(true);
    this.demandeService.valider(d.id).subscribe({
      next: updated => {
        this.demandes.update(list => list.map(x => x.id === updated.id ? updated : x));
        this.actionLoading.set(false);
        this.fermerDetail();
      },
      error: () => this.actionLoading.set(false),
    });
  }

  ouvrirRejet(): void { this.motifRejet.set(''); this.rejetDialog.set(true); }

  confirmerRejet(): void {
    const d = this.demandeDetail();
    if (!d || !this.motifRejet().trim()) return;
    this.actionLoading.set(true);
    this.demandeService.rejeter(d.id, { motifRejet: this.motifRejet() }).subscribe({
      next: updated => {
        this.demandes.update(list => list.map(x => x.id === updated.id ? updated : x));
        this.actionLoading.set(false);
        this.fermerDetail();
      },
      error: () => this.actionLoading.set(false),
    });
  }

  statutLabel(s: string): string { return STATUT_CONFIG[s as StatutDemande]?.label ?? s; }
  statutCss(s: string):   string { return STATUT_CONFIG[s as StatutDemande]?.css ?? ''; }
}
