export interface AuthorizedProvider {
  healthcareProviderEmail?: string;
  patientUid?: string;
  providerName?: string;
  uid?: string;
}

export interface Medication {
  uid?: string;
  dateStarted?: Date;
  medicationName?: string;
  source?: string;
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
  providerName: string;
  // providerCode: string;
  uid?: string;
  capabilities: string[];
}

export interface Account {
  insuranceProviders: InsuranceProvider[];
  healthcareProviders: AuthorizedProvider[];
}

export interface InsuranceMetadata {
  publisher: string;
  capabilities: string[];
}
