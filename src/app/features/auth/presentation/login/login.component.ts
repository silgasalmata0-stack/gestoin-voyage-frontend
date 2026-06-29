import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LoginUseCase } from '../../application/login.use-case';
import { KeepAliveService } from '../../../../core/keep-alive.service';
import { LoginCredentials, InscriptionRequest } from '../../domain/auth-user.model';
import { RoleService } from '../../../../core/role.service';
import { environment } from '../../../../../environments/environment';

const MAX_RETRIES    = 3;
const RETRY_DELAY_MS = 5000;

function ujkzEmailValidator(control: AbstractControl) {
  const v: string = control.value ?? '';
  if (!v) return null;
  return v.endsWith('@ujkz.bf') ? null : { ujkzEmail: true };
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit, OnDestroy {
  private fb           = inject(FormBuilder);
  private loginUseCase = inject(LoginUseCase);
  private keepAlive    = inject(KeepAliveService);
  private router       = inject(Router);
  private http         = inject(HttpClient);
  private roleService  = inject(RoleService);

  // ── Onglet actif
  onglet = signal<'connexion' | 'inscription'>('connexion');

  // ── Formulaire connexion
  loginForm: FormGroup = this.fb.group({
    email:      ['', [Validators.required, Validators.email]],
    motDePasse: ['', Validators.required],
  });

  // ── Formulaire inscription
  inscriptionForm: FormGroup = this.fb.group({
    nom:        ['', Validators.required],
    prenom:     ['', Validators.required],
    email:      ['', [Validators.required, Validators.email, ujkzEmailValidator]],
    matricule:  ['', Validators.required],
    motDePasse: ['', [Validators.required, Validators.minLength(8)]],
    specialite: [''],
    grade:      [''],
    departement:[''],
    faculte:    [''],
  });

  isLoading      = signal(false);
  showPassword   = signal(false);
  showInscPwd    = signal(false);
  errorMessage   = signal<string | null>(null);
  wakingUp       = signal(false);
  inscriptionOk  = signal(false);

  get email()      { return this.loginForm.get('email')!; }
  get motDePasse() { return this.loginForm.get('motDePasse')!; }
  get iNom()       { return this.inscriptionForm.get('nom')!; }
  get iPrenom()    { return this.inscriptionForm.get('prenom')!; }
  get iEmail()     { return this.inscriptionForm.get('email')!; }
  get iMatricule() { return this.inscriptionForm.get('matricule')!; }
  get iMotDePasse(){ return this.inscriptionForm.get('motDePasse')!; }

  ngOnInit(): void  { this.keepAlive.start(); }
  ngOnDestroy(): void { this.keepAlive.stop(); }

  setOnglet(o: 'connexion' | 'inscription'): void {
    this.onglet.set(o);
    this.errorMessage.set(null);
    this.inscriptionOk.set(false);
  }

  togglePassword(): void    { this.showPassword.update(v => !v); }
  toggleInscPwd(): void     { this.showInscPwd.update(v => !v); }

  // Auto-compléter @ujkz.bf si l'utilisateur n'a pas encore le domaine
  autoSuffixEmail(): void {
    const ctrl = this.iEmail;
    const v: string = ctrl.value ?? '';
    if (v && !v.includes('@')) {
      ctrl.setValue(v + '@ujkz.bf');
    }
  }

  // ── Connexion
  onSubmit(): void {
    if (this.loginForm.invalid) { this.loginForm.markAllAsTouched(); return; }
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.wakingUp.set(false);
    this.attempt(this.loginForm.value as LoginCredentials, 0);
  }

  private attempt(credentials: LoginCredentials, retry: number): void {
    this.loginUseCase.execute(credentials).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.wakingUp.set(false);
        this.router.navigateByUrl(this.roleService.getHomeRoute());
      },
      error: (err) => {
        const isSleep = err.status === 503;
        if (isSleep && retry < MAX_RETRIES) {
          this.wakingUp.set(true);
          setTimeout(() => this.attempt(credentials, retry + 1), RETRY_DELAY_MS);
        } else {
          this.isLoading.set(false);
          this.wakingUp.set(false);
          this.errorMessage.set(err.error?.message ?? 'Identifiants incorrects. Veuillez réessayer.');
        }
      },
    });
  }

  // ── Inscription enseignant
  onInscrire(): void {
    if (this.inscriptionForm.invalid) { this.inscriptionForm.markAllAsTouched(); return; }
    this.isLoading.set(true);
    this.errorMessage.set(null);
    const v = this.inscriptionForm.value;
    const payload: InscriptionRequest = {
      matricule:   v.matricule,
      nom:         v.nom,
      prenom:      v.prenom,
      email:       v.email,
      motDePasse:  v.motDePasse,
      specialite:  v.specialite  || undefined,
      grade:       v.grade       || undefined,
      departement: v.departement || undefined,
      faculte:     v.faculte     || undefined,
    };
    this.http.post(`${environment.apiUrl}/auth/inscription`, payload).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.inscriptionOk.set(true);
        this.inscriptionForm.reset();
      },
      error: (err) => {
        this.isLoading.set(false);
        const detail = err.error?.errors
          ? Object.entries(err.error.errors).map(([k, v]) => `${k}: ${v}`).join(' — ')
          : err.error?.message ?? 'Erreur lors de l\'inscription.';
        this.errorMessage.set(detail);
      },
    });
  }
}
