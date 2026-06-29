export type StatutSession = 'OUVERTE' | 'FERMEE';

export interface Session {
  id:                    number;
  annee:                 number;
  dateOuverture:         string;
  dateCloture:           string | null;
  statut:                StatutSession;
  ouverteParNom:         string;
  createdAt:             string;
  communiqueUrl:         string | null;
  communiqueNomFichier:  string | null;
}
