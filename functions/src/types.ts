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

// TODO - move to types
export interface DerivedMedicationHistory {
  date?: string;
  type?: string;
  daysSupply?: number; // if med dispense doesn't have it then use med request
  dosage?: string;
  quantity?: string; // if med dispense doesn't have it then use med request
}

// TODO - move to types
// each of these should be a single medication
export interface MedContext {
  request: MedicationRequest[];
  dispense: MedicationDispense[];
  derivedHistory: DerivedMedicationHistory[];
}

// TODO – add in all the meds that are connected to this med
export interface DerivedMedication {
  lastRequestedOn?: string;
  firstRequestedOn?: string;
  lastFillOn?: string;
  firstFillOn?: string;
  code?: string; // you can get the patient input from this code, so have like a patient modification, by code
  codeDisplay?: string;
  request?: MedicationRequest[];
  dispense?: MedicationDispense[];
  // quantity?: number; // if med dispense doesn't have it then use med request
  // daysSupply?: number; // if med dispense doesn't have it then use med request
  // dosage?: string;
  source?: string; // if the patient has modified the derived me by the code then should be claims + patient
  derivedMedicationHistory: DerivedMedicationHistory[];
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
  userUid?: string;
  primaryDate?: string;
}

export interface MedicationDispense {
  uid?: string;
  flexpaResourceId?: string;
  insuranceProviderUid?: string;
  status?: string;
  code?: string;
  codeDisplay?: string;
  type?: string;
  quantityValue?: number; // just quantity
  quantityUnit?: string; // just quantity
  daysSupply?: number;
  whenHandedOver?: string;
  intent?: string;
  source?: string;
  userUid?: string;
  primaryDate?: string;
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
  userUid?: string;
  primaryDate?: string;
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
  userUid?: string;
  primaryDate?: string;
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
  userUid?: string;
  primaryDate?: string;
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
  userUid?: string;
  primaryDate?: string;
}

export interface Encounter {
  uid?: string;
  flexpaResourceId?: string;
  insuranceProviderUid?: string;
  source?: string;
  userUid?: string;
  status?: string;
  start?: string;
  end?: string;
  code?: string;
  primaryDate?: string;
}

export interface CareTeamParticipant {
  roleCode?: string;
  roleCodeDisplay?: string;
  memberCode?: string;
  memberCodeDisplay?: string;
  primaryDate?: string;
}

export interface CareTeam {
  uid?: string;
  flexpaResourceId?: string;
  insuranceProviderUid?: string;
  source?: string;
  userUid?: string;
  status?: string;
  participants?: CareTeamParticipant[];
}

export interface ClaimsData {
  medicationRequest: MedicationRequest[];
  medicationDispense: MedicationDispense[];
  derivedClaimsMedications?: DerivedMedication[];
  allergyIntolerance: AllergyIntolerance[];
  procedure: Procedure[];
  immunization: Immunization[];
  condition: Condition[];
  encounter: Encounter[];
  observation: Observation[];
  careTeam: CareTeam[];
}

export interface Observation {
  uid?: string;
  source?: string;
  status?: string;
  category?: string;
  code?: string;
  codeDisplay?: string;
  effectiveDateTime?: string;
  issued?: string;
  userUid?: string;
  flexpaResourceId?: string;
  primaryDate?: string;
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

// TODO – handle provider/role/patient
// save the flexpa resource id and the code
// so if its med, just query by code
// if its anything else, do uid
export interface Note {
  uid?: string;
  userUid?: string;
  // type?: string; // MEDICATION, ALLERGY, etc
  text?: string; // note text
  // medicationCode?: string;
  parentUid?: string; // what it's a note for
  // role?: string;
}
