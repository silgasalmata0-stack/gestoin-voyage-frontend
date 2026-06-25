import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { User } from '../user.model';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css'
})
export class UserList implements OnInit {

  private userService = inject(UserService);

  utilisateurs = signal<User[]>([]);
  loading = signal(false);
  erreur = signal('');

  ngOnInit(): void {
    this.chargerUtilisateurs();
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
        this.erreur.set('Erreur lors du chargement');
        this.loading.set(false);
      }
    });
  }
}
