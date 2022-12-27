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
  flexpaResourceId?: string;
  insuranceProviderUid?: string;
}

// TODO – add in all the meds that are connected to this med
export interface DerivedMedication {
  lastRequestedOn?: string;
  lastFilledOn?: string;
  firstFillOn?: string;
  code?: string;
  codeDisplay?: string;
}

export interface MedicationRequest {
  uid?: string;
  authoredOn?: string; // when request was made
  code?: string;
  codeDisplay?: string;
  source?: string;
  status?: string;
  intent?: string;
  requesterIdentifier?: string;
  requester?: string;
  dosageInstructionText?: string;
  dosageInstructionRoute?: string;
  doseAndRateQuantityValue?: number;
  doseAndRateQuantityUnit?: string;
  flexpaResourceId?: string;
  insuranceProviderUid?: string;
}

export interface MedicationDispense {
  uid?: string;
  flexpaResourceId?: string;
  insuranceProviderUid?: string;
  status?: string;
  code?: string;
  codeDisplay?: string;
  type?: string;
  quantityValue?: number;
  quantityUnit?: string;
  daysSupply?: number;
  whenHandedOver?: string;
  intent?: string;
  source?: string;
}

export interface AllergyIntolerance {
  uid?: string;
  flexpaResourceId?: string;
  insuranceProviderUid?: string;
  source?: string;
  clinicalStatus?: string;
  verificationStatus?: string;
  code?: string; // the code of what is causing the reaction
  codeDisplay?: string; // the name of the item
  onsetDateTime?: string;
  recordedDate?: string;
  recorder?: string;
  asserter?: string;
  reactionManifestation?: string;
  recorderIdentifier?: string;
  asserterIdentifier?: string;
}

export interface Condition {
  uid?: string;
  flexpaResourceId?: string;
  insuranceProviderUid?: string;
  source?: string;
  clinicalStatus?: string;
  verificationStatus?: string;
  category?: string;
  code?: string;
  codeDisplay?: string; // the condition
}

export interface Immunization {
  uid?: string;
  flexpaResourceId?: string;
  insuranceProviderUid?: string;
  source?: string;
  status?: string;
  code?: string;
  codeDisplay?: string; // the vaccine display
  occurenceDateTime?: string;
}

export interface Procedure {
  uid?: string;
  flexpaResourceId?: string;
  insuranceProviderUid?: string;
  source?: string;
  status?: string;
  code?: string;
  codeDisplay?: string; // the procedure display
  performedDateTime?: string;
  recorder?: string;
  recorderIdentifier?: string;
  performer?: string;
  performerIdentifier?: string;
}

export interface ClaimsData {
  medicationRequest: MedicationRequest[];
  medicationDispense: MedicationDispense[];
  derivedClaimsMedications?: DerivedMedication[];
  allergyIntolerance: AllergyIntolerance[];
  procedure: Procedure[];
  immunization: Immunization[];
  condition: Condition[];
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

export interface AddHealthInsuranceProviderResponse {
  insuranceProvider?: InsuranceProvider;
  medications?: Medication[];
  claimsData?: ClaimsData;
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
