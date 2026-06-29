import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css'
})
export class UserList implements OnInit {

  private userService = inject(UserService);

  utilisateurs = signal<any[]>([]);
  loading = signal(false);
  erreur = signal('');

  get totalUtilisateurs() { return this.utilisateurs().length; }
  get totalEnseignants() { return this.utilisateurs().filter(u => u.role === 'ROLE_ENSEIGNANT').length; }
  get totalAgents() { return this.utilisateurs().filter(u => ['ROLE_DRIPE','ROLE_FINANCIER','ROLE_PRESIDENCE'].includes(u.role)).length; }
  get totalAdmins() { return this.utilisateurs().filter(u => u.role === 'ROLE_ADMIN').length; }

  ngOnInit(): void {
    this.chargerUtilisateurs();
  }

  chargerUtilisateurs(): void {
    this.loading.set(true);
    this.erreur.set('');
    this.userService.getUtilisateurs().subscribe({
      next: (data: any[]) => {
        this.utilisateurs.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.erreur.set('Erreur lors du chargement');
        this.loading.set(false);
      }
    });
  }

  getRoleDisplayName(role: string): string {
    const map: { [key: string]: string } = {
      'ROLE_ENSEIGNANT': 'Enseignant',
      'ROLE_DRIPE': 'DRIPE',
      'ROLE_FINANCIER': 'Financier',
      'ROLE_PRESIDENCE': 'Présidence',
      'ROLE_ADMIN': 'Admin'
    };
    return map[role] || role;
  }
}