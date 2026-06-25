import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { User } from '../user.model'; // 1. Importe ton modèle

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css'
})
export class UserList implements OnInit {

  utilisateurs: User[] = []; // 2. Remplace any[] par User[]
  loading = false;
  erreur = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.chargerUtilisateurs();
  }

  chargerUtilisateurs(): void {
    this.loading = true;
    this.userService.getUtilisateurs().subscribe({
      next: (data: User[]) => { // 3. Tu peux optionnellement typer data ici
        this.utilisateurs = data;
        this.loading = false;
      },
      error: (err) => {
        this.erreur = 'Erreur lors du chargement';
        this.loading = false;
      }
    });
  }
}