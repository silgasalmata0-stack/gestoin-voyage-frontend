export interface User {
  id?: string;            // Optionnel, généré par le backend
  nom: string;
  prenom: string;
  email: string;
  role: string;
  
  // Champs ajoutés pour correspondre à ton formulaire
  matricule: string;
  motDePasse: string;
  
  // Champs optionnels (spécifiques à l'enseignant)
  specialite?: string;
  grade?: string;
  departement?: string;
  faculte?: string;
}