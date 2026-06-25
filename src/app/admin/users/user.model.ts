export interface User {
  id?: number;
  matricule: string;
  nom: string;
  prenom: string;
  email: string;
  role: string;
  actif?: boolean;
  createdAt?: string;

  // Champs optionnels 
  specialite?: string;
  grade?: string;
  departement?: string;
  faculte?: string;

  // Uniquement à la création
  motDePasse?: string;
}