import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TokenStorage } from '../../features/auth/infrastructure/token.storage';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  role: string | null = null;

  espaces = [
    {
      titre: 'Enseignant-Chercheur',
      description: 'Soumettre et suivre les demandes de voyage',
      icon: 'ti-school',
      couleur: 'green',
      lien: '/admin/enseignant',
      role: 'ROLE_ENSEIGNANT'
    },
    {
      titre: 'Présidence',
      description: 'Ouvrir les sessions et valider les demandes',
      icon: 'ti-building-community',
      couleur: 'purple',
      lien: '/admin/presidence',
      role: 'ROLE_PRESIDENCE'
    },
    {
      titre: 'DRIPE',
      description: 'Vérifier la conformité des dossiers soumis',
      icon: 'ti-search',
      couleur: 'blue',
      lien: '/admin/dripe',
      role: 'ROLE_DRIPE'
    },
    {
      titre: 'Service Financier',
      description: 'Gérer l\'exécution financière des voyages',
      icon: 'ti-coin',
      couleur: 'amber',
      lien: '/admin/finances',
      role: 'ROLE_FINANCIER'
    },
    {
      titre: 'Administration Technique',
      description: 'Gérer les comptes et les droits d\'accès',
      icon: 'ti-settings',
      couleur: 'gray',
      lien: '/admin/users',
      role: 'ROLE_ADMIN'
    }
  ];

  constructor(
    private tokenStorage: TokenStorage,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.role = this.tokenStorage.getRole();

    // Redirection automatique selon le rôle
    switch (this.role) {
      case 'ROLE_ENSEIGNANT':
        this.router.navigate(['/admin/enseignant']);
        break;
      case 'ROLE_PRESIDENCE':
        this.router.navigate(['/admin/presidence']);
        break;
      case 'ROLE_DRIPE':
        this.router.navigate(['/admin/dripe']);
        break;
      case 'ROLE_FINANCIER':
        this.router.navigate(['/admin/finances']);
        break;
      case 'ROLE_ADMIN':
        // L'admin reste sur le tableau de bord général
        break;
    }
  }

  getEspacesVisibles() {
    // L'admin voit tous les espaces
    if (this.role === 'ROLE_ADMIN') {
      return this.espaces;
    }
    // Les autres voient uniquement leur espace
    return this.espaces.filter(e => e.role === this.role);
  }
}