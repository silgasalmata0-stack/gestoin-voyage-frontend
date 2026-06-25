import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { UserService, UserCreatePayload } from '../../../services/user.service';

// Rôles disponibles 
const ROLES = [
  { value: 'ROLE_ENSEIGNANT',  label: 'Enseignant Chercheur' },
  { value: 'ROLE_DRIPE',       label: 'Agent DRIPE' },
  { value: 'ROLE_FINANCIER',   label: 'Agent Financier' },
  { value: 'ROLE_PRESIDENCE',  label: 'Présidence' },
  { value: 'ROLE_ADMIN',       label: 'Administrateur Technique' },
];

@Component({
  selector: 'app-user-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './user-create.html',
  styleUrl: './user-create.css',
})
export class UserCreate {
  private fb          = inject(FormBuilder);
  private userService = inject(UserService);
  private router      = inject(Router);

  readonly roles = ROLES;

  loading = signal(false);
  erreur  = signal('');
  succes  = signal('');

  userForm = this.fb.group({
    nom:        ['', Validators.required],
    prenom:     ['', Validators.required],
    email:      ['', [Validators.required, Validators.email]],
    matricule:  ['', Validators.required],
    motDePasse: ['', [Validators.required, Validators.minLength(8)]],
    role:       ['', Validators.required],
    // Champs spécifiques ENSEIGNANT
    specialite:  [''],
    grade:       [''],
    departement: [''],
    faculte:     [''],
  });

  get roleSelectionne(): string {
    return this.userForm.get('role')?.value ?? '';
  }

  get estEnseignant(): boolean {
    return this.roleSelectionne === 'ROLE_ENSEIGNANT';
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      this.erreur.set('Veuillez remplir correctement tous les champs requis.');
      return;
    }

    this.loading.set(true);
    this.erreur.set('');
    this.succes.set('');

    const v = this.userForm.value;

    // Construire le payload 
    const payload: UserCreatePayload = {
      matricule:  v.matricule!,
      nom:        v.nom!,
      prenom:     v.prenom!,
      email:      v.email!,
      motDePasse: v.motDePasse!,
      role:       v.role!,  
    };

    // Ajouter les champs spécifiques 
    if (this.estEnseignant) {
      payload.specialite  = v.specialite  || '';
      payload.grade       = v.grade       || undefined;
      payload.departement = v.departement || undefined;
      payload.faculte     = v.faculte     || undefined;
    }

    this.userService.creerUtilisateur(payload).subscribe({
      next: () => {
        this.succes.set('Utilisateur créé avec succès !');
        this.loading.set(false);
        setTimeout(() => this.router.navigate(['/admin/users']), 1500);
      },
      error: (err) => {
        console.error('Erreur création utilisateur :', err);
        // Afficher les erreurs de validation champ par champ si disponibles
        const detail = err.error?.errors
          ? Object.entries(err.error.errors).map(([k, v]) => `${k}: ${v}`).join(' | ')
          : err.error?.message ?? 'Erreur serveur.';
        this.erreur.set(detail);
        this.loading.set(false);
      }
    });
  }
}