import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { UserService, UserCreatePayload } from '../../../services/user.service';

const ROLES = [
  { value: 'ROLE_ENSEIGNANT',  label: 'Enseignant', desc: 'Chercheur ou enseignant-chercheur', icon: 'school' },
  { value: 'ROLE_DRIPE',       label: 'DRIPE',      desc: 'Direction des relations interuniversitaires', icon: 'account_tree' },
  { value: 'ROLE_FINANCIER',   label: 'Financier',  desc: 'Service financier et comptabilité', icon: 'account_balance' },
  { value: 'ROLE_PRESIDENCE',  label: 'Présidence', desc: 'Cabinet du Président de l\'université', icon: 'gavel' },
  { value: 'ROLE_ADMIN',       label: 'Admin',      desc: 'Administrateur technique du système', icon: 'settings' },
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

  loading    = signal(false);
  erreur     = signal('');
  succes     = signal(false);
  showPwd    = signal(false);
  roleChoisi = signal('');

  userForm = this.fb.group({
    nom:        ['', Validators.required],
    prenom:     ['', Validators.required],
    email:      ['', [Validators.required, Validators.email]],
    matricule:  ['', Validators.required],
    motDePasse: ['', [Validators.required, Validators.minLength(8)]],
    // ENSEIGNANT
    specialite:  [''],
    grade:       [''],
    departement: [''],
    faculte:     [''],
  });

  get estEnseignant(): boolean { return this.roleChoisi() === 'ROLE_ENSEIGNANT'; }

  setRole(val: string): void { this.roleChoisi.set(val); }

  f(name: string) { return this.userForm.get(name)!; }

  onSubmit(): void {
    if (!this.roleChoisi()) {
      this.erreur.set('Veuillez sélectionner un rôle.');
      return;
    }
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      this.erreur.set('Veuillez remplir tous les champs requis.');
      return;
    }
    this.loading.set(true);
    this.erreur.set('');
    const v = this.userForm.value;
    const payload: UserCreatePayload = {
      matricule:  v.matricule!,
      nom:        v.nom!,
      prenom:     v.prenom!,
      email:      v.email!,
      motDePasse: v.motDePasse!,
      role:       this.roleChoisi(),
      ...(this.estEnseignant ? {
        specialite:  v.specialite  || undefined,
        grade:       v.grade       || undefined,
        departement: v.departement || undefined,
        faculte:     v.faculte     || undefined,
      } : {}),
    };
    this.userService.creerUtilisateur(payload).subscribe({
      next: () => {
        this.loading.set(false);
        this.succes.set(true);
        setTimeout(() => this.router.navigate(['/admin/users']), 2000);
      },
      error: (err) => {
        const detail = err.error?.errors
          ? Object.entries(err.error.errors).map(([k, val]) => `${k}: ${val}`).join(' — ')
          : err.error?.message ?? 'Erreur serveur.';
        this.erreur.set(detail);
        this.loading.set(false);
      }
    });
  }
}
