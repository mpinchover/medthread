export interface AuthorizedProvider {
  healthcareProviderEmail?: string;
  patientUid?: string;
  providerName?: string;
  uid?: string;
}

export interface Medication {
  uid?: string;
  dateStarted?: Date;
}

export interface Profile {
  uid?: string;
  role?: string;
}

export interface AuthProfile {
  uid?: string;
  email?: string;
  emailVerified?: boolean;
}

export interface InsuranceProvider {
  userUid: string;
  accessToken: string;
  publicToken: string;
  providerName: string;
}
