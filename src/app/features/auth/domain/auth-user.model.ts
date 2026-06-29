export interface AuthUser {
  email: string;
  role: string;
  nom?: string;
  prenom?: string;
}

export interface LoginCredentials {
  email: string;
  motDePasse: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResult {
  user: AuthUser;
  tokens: AuthTokens;
}

export interface InscriptionRequest {
  matricule: string;
  nom: string;
  prenom: string;
  email: string;        // obligatoirement @ujkz.bf
  motDePasse: string;
  specialite?: string;
  grade?: string;
  departement?: string;
  faculte?: string;
}
