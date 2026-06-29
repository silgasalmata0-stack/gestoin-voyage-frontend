import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { User } from '../user.model';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css'
})
export class UserList implements OnInit {

  private userService = inject(UserService);

  utilisateurs   = signal<User[]>([]);
  enAttente      = signal<User[]>([]);
  loading        = signal(false);
  loadingAttente = signal(false);
  erreur         = signal('');
  recherche      = signal('');
  filtreRole     = signal('');
  onglet         = signal<'tous' | 'attente'>('tous');
  actionEnCours  = signal<number | null>(null);

  readonly roles = ['ROLE_ENSEIGNANT', 'ROLE_DRIPE', 'ROLE_PRESIDENCE', 'ROLE_FINANCIER', 'ROLE_ADMIN'];

  readonly stats = computed(() => {
    const u = this.utilisateurs();
    return {
      total:    u.length,
      actifs:   u.filter(x => x.actif).length,
      inactifs: u.filter(x => !x.actif).length,
      attente:  this.enAttente().length,
    };
  });

  readonly filtres = computed(() => {
    const r = this.recherche().toLowerCase();
    const role = this.filtreRole();
    return this.utilisateurs().filter(u => {
      const matchRecherche = !r ||
        u.nom.toLowerCase().includes(r) ||
        u.prenom.toLowerCase().includes(r) ||
        u.email.toLowerCase().includes(r) ||
        u.matricule.toLowerCase().includes(r);
      const matchRole = !role || u.role === role;
      return matchRecherche && matchRole;
    });
  });

  ngOnInit(): void {
    this.chargerUtilisateurs();
    this.chargerEnAttente();
  }

  chargerUtilisateurs(): void {
    this.loading.set(true);
    this.erreur.set('');
    this.userService.getUtilisateurs().subscribe({
      next: (data: User[]) => {
        this.utilisateurs.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.erreur.set('Erreur lors du chargement des utilisateurs.');
        this.loading.set(false);
      }
    });
  }

  chargerEnAttente(): void {
    this.loadingAttente.set(true);
    this.userService.getEnAttente().subscribe({
      next: (data: User[]) => {
        this.enAttente.set(data);
        this.loadingAttente.set(false);
      },
      error: () => this.loadingAttente.set(false)
    });
  }

  activer(u: User): void {
    if (!u.id || this.actionEnCours() !== null) return;
    this.actionEnCours.set(u.id);
    this.userService.activerUtilisateur(u.id).subscribe({
      next: () => {
        this.actionEnCours.set(null);
        this.chargerUtilisateurs();
        this.chargerEnAttente();
      },
      error: () => this.actionEnCours.set(null)
    });
  }

  desactiver(u: User): void {
    if (!u.id || this.actionEnCours() !== null) return;
    if (!confirm(`Désactiver ${u.prenom} ${u.nom} ?`)) return;
    this.actionEnCours.set(u.id);
    this.userService.supprimerUtilisateur(u.id).subscribe({
      next: () => {
        this.actionEnCours.set(null);
        this.chargerUtilisateurs();
      },
      error: () => this.actionEnCours.set(null)
    });
  }

  setOnglet(o: 'tous' | 'attente'): void { this.onglet.set(o); }

  initiales(u: User): string {
    return ((u.prenom?.[0] ?? '') + (u.nom?.[0] ?? '')).toUpperCase();
  }

  couleurRole(role: string): string {
    const map: Record<string, string> = {
      ROLE_ENSEIGNANT: 'role--enseignant',
      ROLE_DRIPE:      'role--dripe',
      ROLE_PRESIDENCE: 'role--presidence',
      ROLE_FINANCIER:  'role--finance',
      ROLE_ADMIN:      'role--admin',
    };
    return map[role] ?? 'role--default';
  }

  labelRole(role: string): string {
    const map: Record<string, string> = {
      ROLE_ENSEIGNANT: 'Enseignant',
      ROLE_DRIPE:      'DRIPE',
      ROLE_PRESIDENCE: 'Présidence',
      ROLE_FINANCIER:  'Financier',
      ROLE_ADMIN:      'Administrateur',
    };
    return map[role] ?? role;
  }
}
