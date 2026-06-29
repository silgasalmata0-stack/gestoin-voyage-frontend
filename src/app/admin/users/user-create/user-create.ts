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
  etapeActuelle = 1;
  totalEtapes = 3;

  etapes = [
    { numero: 1, label: 'Informations', icon: 'ti-user' },
    { numero: 2, label: 'Rôle', icon: 'ti-shield-lock' },
    { numero: 3, label: 'Confirmation', icon: 'ti-list-check' }
  ];

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
      motDePasse: ['', [Validators.required, Validators.minLength(6)]],
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

  chargerRoles(): void {
    this.userService.getRoles().subscribe({
      next: (data: any[]) => { this.roles = data; },
      error: () => {
        this.roles = [
          { id: 1, nom: 'ROLE_ENSEIGNANT', label: 'Enseignant Chercheur' },
          { id: 2, nom: 'ROLE_DRIPE', label: 'Agent DRIPE' },
          { id: 3, nom: 'ROLE_FINANCIER', label: 'Agent Financier' },
          { id: 4, nom: 'ROLE_PRESIDENCE', label: 'Présidence' },
          { id: 5, nom: 'ROLE_ADMIN', label: 'Administrateur Technique' }
        ];
      }
    });
  }

  onRoleChange(event: any): void {
    const role = this.roles.find(r => r.id == event.target.value);
    this.roleSelectionne = role?.nom || '';
  }

  etapeSuivante(): void {
    if (this.etapeActuelle < this.totalEtapes) {
      this.etapeActuelle++;
    }
  }

  etapePrecedente(): void {
    if (this.etapeActuelle > 1) {
      this.etapeActuelle--;
    }
  }

  getRoleLabel(): string {
    const role = this.roles.find(r => r.id == this.userForm.get('roleId')?.value);
    return role?.label || '—';
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.erreur = 'Veuillez remplir correctement tous les champs.';
      return;
    }
    this.loading = true;
    this.erreur = '';
    this.succes = '';

    const formValue = { ...this.userForm.value };

    const donnees: any = {
      nom: formValue.nom,
      prenom: formValue.prenom,
      email: formValue.email,
      matricule: formValue.matricule,
      motDePasse: formValue.motDePasse,
      role: this.roleSelectionne
    };

    if (this.roleSelectionne === 'ROLE_ENSEIGNANT') {
      donnees.specialite = formValue.specialite;
      donnees.grade = formValue.grade;
      donnees.departement = formValue.departement;
      donnees.faculte = formValue.faculte;
    }

    console.log('Payload envoyé :', donnees);

    this.userService.creerUtilisateur(donnees).subscribe({
      next: () => {
        this.succes = 'Utilisateur créé avec succès !';
        this.loading = false;
        setTimeout(() => this.router.navigate(['/admin/users']), 1500);
      },
     error: (err: any) => {
  console.error('STATUS :', err.status);
  console.error('ERREUR :', err.error);
  this.erreur = err.error?.message
    || err.error?.error
    || `Erreur ${err.status}`;
  this.loading = false;
}
    });
  }
}