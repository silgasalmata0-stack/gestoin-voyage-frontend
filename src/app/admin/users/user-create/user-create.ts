import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-user-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './user-create.html',
  styleUrl: './user-create.css',
})
export class UserCreate implements OnInit {

  userForm: FormGroup;
  loading = false;
  erreur = '';
  succes = '';
  roleSelectionne = '';
  roles: any[] = [];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      matricule: ['', Validators.required],
      motDePasse: ['', Validators.required],
      roleId: ['', Validators.required],
      specialite: [''],
      grade: [''],
      departement: [''],
      faculte: ['']
    });
  }

  ngOnInit(): void {
    this.chargerRoles();
  }

  // Charger les rôles depuis l'API
  chargerRoles(): void {
    this.userService.getRoles().subscribe({
      next: (data) => {
        this.roles = data;
        console.log('Rôles chargés :', data);
      },
      error: (err) => {
        console.error('Erreur chargement rôles :', err);
        // Rôles par défaut si l'API échoue
        this.roles = [
          { id: 1, nom: 'ROLE_ENSEIGNANT', label: 'Enseignant Chercheur' },
          { id: 2, nom: 'ROLE_DRIPE', label: 'Agent DRIPE' },
          { id: 3, nom: 'ROLE_FINANCIER', label: 'Agent Financier' },
          { id: 4, nom: 'ROLE_PRESIDENCE', label: 'Présidence' }
        ];
      }
    });
  }

  onRoleChange(event: any): void {
    const roleSelectionne = this.roles.find(r => r.id == event.target.value);
    this.roleSelectionne = roleSelectionne?.nom || '';
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.erreur = 'Veuillez remplir correctement tous les champs requis.';
      return;
    }

    this.loading = true;
    this.erreur = '';
    this.succes = '';

    const donnees = { ...this.userForm.value };

    // Nettoyer les champs enseignant si pas enseignant
    if (this.roleSelectionne !== 'ROLE_ENSEIGNANT') {
      delete donnees.specialite;
      delete donnees.grade;
      delete donnees.departement;
      delete donnees.faculte;
    }

    console.log('Données envoyées :', donnees);

    this.userService.creerUtilisateur(donnees).subscribe({
      next: () => {
        this.succes = 'Utilisateur créé avec succès !';
        this.loading = false;
        setTimeout(() => this.router.navigate(['/admin/users']), 1500);
      },
      error: (err) => {
        console.error('Erreur :', err);
        this.erreur = err.error?.message || 'Erreur serveur. Vérifiez la console F12.';
        this.loading = false;
      }
    });
  }
}