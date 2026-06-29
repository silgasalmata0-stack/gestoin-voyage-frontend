export type StatutDemande =
  | 'BROUILLON'
  | 'SOUMISE'
  | 'EN_INSTRUCTION'
  | 'TRANSMISE'
  | 'VALIDEE'
  | 'REJETEE'
  | 'ANNULEE'
  | 'EN_ATTENTE_JUSTIFICATIFS'
  | 'SOLDEE';

export interface DemandeVoyage {
  id:                      number;
  reference:               string;
  statut:                  StatutDemande;

  enseignantId:            number;
  enseignantNom:           string;
  enseignantMatricule:     string;

  sessionId:               number;
  sessionAnnee:            number;

  pays:                    string;
  ville:                   string;
  etablissementAccueil:    string;
  motifVoyage:             string;
  dateDepart:              string;
  dateRetour:              string;

  regionId:                number | null;
  regionNom:               string | null;
  continentNom:            string | null;
  montantForfait:          number | null;
  universitePartenaireId:  number | null;
  universitePartenaireNom: string | null;

  instruitParNom:          string | null;
  valideeOuRejeteeParNom:  string | null;
  motifRejet:              string | null;
  lettreInvitationUrl:     string | null;

  createdAt:               string;
  updatedAt:               string;
}

export interface DemandeVoyageRequest {
  universitePartenaireId?: number;
  regionId?:               number;
  regionNomLibre?:         string;
  pays:                    string;
  ville:                   string;
  etablissementAccueil:    string;
  motifVoyage:             string;
  dateDepart:              string;
  dateRetour:              string;
  lettreInvitationUrl?:    string;
}

export interface InstruireRequest {
  observations?: string;
}

export interface RejeterRequest {
  motifRejet: string;
}

export interface PageResponse<T> {
  content:       T[];
  page:          number;
  size:          number;
  totalElements: number;
  totalPages:    number;
  dernierePage:  boolean;
}

// Libellés et couleurs des statuts
export const STATUT_CONFIG: Record<StatutDemande, { label: string; css: string }> = {
  BROUILLON:                 { label: 'Brouillon',            css: 'statut--brouillon' },
  SOUMISE:                   { label: 'Soumise',              css: 'statut--soumise' },
  EN_INSTRUCTION:            { label: 'En instruction',       css: 'statut--instruction' },
  TRANSMISE:                 { label: 'Transmise Présidence', css: 'statut--transmise' },
  VALIDEE:                   { label: 'Validée',              css: 'statut--validee' },
  REJETEE:                   { label: 'Rejetée',              css: 'statut--rejetee' },
  ANNULEE:                   { label: 'Annulée',              css: 'statut--annulee' },
  EN_ATTENTE_JUSTIFICATIFS:  { label: 'Att. justificatifs',   css: 'statut--attente-just' },
  SOLDEE:                    { label: 'Soldée',               css: 'statut--soldee' },
};
