import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginUseCase } from '../../application/login.use-case';
import { KeepAliveService } from '../../../../core/keep-alive.service';
import { LoginCredentials } from '../../domain/auth-user.model';

const MAX_RETRIES    = 3;
const RETRY_DELAY_MS = 5000;

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

  loginForm: FormGroup = this.fb.group({
    email:      ['', [Validators.required, Validators.email]],
    motDePasse: ['', Validators.required],
  });

  isLoading    = signal(false);
  showPassword = signal(false);
  errorMessage = signal<string | null>(null);
  wakingUp     = signal(false);

  get email()      { return this.loginForm.get('email')!; }
  get motDePasse() { return this.loginForm.get('motDePasse')!; }

  ngOnInit(): void  { this.keepAlive.start(); }
  ngOnDestroy(): void { this.keepAlive.stop(); }

  togglePassword(): void { this.showPassword.update((v) => !v); }

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
        this.router.navigate(['/admin']);
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
}
