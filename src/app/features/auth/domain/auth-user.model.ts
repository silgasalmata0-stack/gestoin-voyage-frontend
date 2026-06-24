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
