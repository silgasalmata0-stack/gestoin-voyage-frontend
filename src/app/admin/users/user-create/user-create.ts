import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router'; // Import du Router
import { UserService } from '../../../services/user.service';
import { User } from '../user.model';

@Component({
  selector: 'app-user-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './user-create.html',
  styleUrl: './user-create.css',
})
export class UserCreate {

  userForm: FormGroup;
  loading = false;
  erreur = '';
  succes = '';
  roleSelectionne = '';

  roles = [
    { valeur: 'ROLE_ENSEIGNANT', label: 'Enseignant Chercheur' },
    { valeur: 'ROLE_DRIPE', label: 'Agent DRIPE' },
    { valeur: 'ROLE_FINANCIER', label: 'Agent Financier' },
    { valeur: 'ROLE_PRESIDENCE', label: 'Présidence' }
  ];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router // Injection du Router
  ) {
    this.userForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      matricule: ['', Validators.required],
      motDePasse: ['', Validators.required],
      role: ['', Validators.required],
      specialite: [''],
      grade: [''],
      departement: [''],
      faculte: ['']
    });
  }

  onRoleChange(event: any): void {
    this.roleSelectionne = event.target.value;
  }

  // ... tes imports restent les mêmes ...

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.erreur = 'Veuillez remplir correctement tous les champs requis.';
      return;
    }

    this.loading = true;
    this.erreur = '';
    this.succes = '';

    // Préparation des données
    const donnees = { ...this.userForm.value };

    // Nettoyage des champs si le rôle n'est pas Enseignant
    if (donnees.role !== 'ROLE_ENSEIGNANT') {
      delete donnees.specialite;
      delete donnees.grade;
      delete donnees.departement;
      delete donnees.faculte;
    }

    this.userService.creerUtilisateur(donnees).subscribe({
      next: () => {
        this.succes = 'Utilisateur créé avec succès !';
        this.loading = false;
        setTimeout(() => this.router.navigate(['/admin/users']), 1500);
      },
      error: (err) => {
        // Affiche l'erreur dans la console pour déboguer
        console.error('Détail de l\'erreur :', err);
        // Affiche l'erreur sur ton interface
        this.erreur = err.error?.message || 'Erreur serveur. Vérifiez la console F12.';
        this.loading = false;
      }
    });
  }
    }
  
