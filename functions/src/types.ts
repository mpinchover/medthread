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
  fhirReference?: string;
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
  fhirReference?: string;
  insuranceProviderUid?: string;
  userUid?: string;
  primaryDate?: string;
}

export interface MedicationDispense {
  uid?: string;
  fhirReference?: string;
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
  fhirReference?: string;
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
  fhirReference?: string;
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
  fhirReference?: string;
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
  fhirReference?: string;
  insuranceProviderUid?: string;
  source?: string;
  status?: string;
  code?: string;
  codeDisplay?: string; // the procedure display
  performedDateTime?: string;
  recorder?: string;
  recorderIdentifier?: string;
  performer?: string;
  performerIdentifier?: string; // NPI code
  userUid?: string;
  primaryDate?: string;
}

export interface Encounter {
  uid?: string;
  fhirReference?: string;
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
}

export interface CareTeam {
  uid?: string;
  fhirReference?: string;
  insuranceProviderUid?: string;
  source?: string;
  userUid?: string;
  status?: string;
  participants?: CareTeamParticipant[];
  primaryDate?: string;
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
  explanationOfBenefit: ExplanationOfBenefit[];
  // carePlan: any[];
  // documentReference: any[];
  // diagnosticReport: any[];
  // practitioner: any[];
  // practitionerRole: any[];
  // patient: any[];
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
  fhirReference?: string;
  primaryDate?: string;
}

export interface Profile {
  uid?: string;
  role?: string;
  account?: UserAccount;
  userUid?: string;
}
export interface UserAccount {
  displayName?: string;
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

export interface PatientRecordsQueryFilter {
  encounter?: boolean;
  encounterTypes?: string[]; // if empty just query everything.
  procedure?: boolean;
  medicationRequest?: boolean;
  medicationDispense?: boolean;
  immunization?: boolean;
  allergyIntolernace?: boolean;
  condition?: boolean;
  userUid?: string;
}

export interface TimelineEvent {
  primaryDate?: string;
  event?: any;
  type?: string;
}

// TODO
// use npi code api?
// https://clinicaltables.nlm.nih.gov/apidoc/npi_org/v3/doc.html
export interface ExplanationOfBenefit {
  uid?: string;
  userUid?: string;
  source?: string;
  jsonResponse?: string;
  fhirReference?: string;
  status?: string;
  type?: EOBType[];
  use?: string;
  patientReference?: string;
  insurer?: string;
  provider?: EOBProvider;
  prescription?: EOBPrescription;
  facilityDisplay?: string;
  outcome?: string;
  items?: EOBItem[];
  billablePeriod?: EOBBillablePeriod;
  created?: string;
  diagnosis?: EOBDiagnosis[];
  procedure?: EOBProcedure[];
  primaryDate?: string;
}

export interface EOBItem {
  sequence?: number;
  productOrService: EOBProductOrService[];
}

export interface EOBType {
  code?: string;
  display?: string;
}

export interface EOBProvider {
  npiCode?: string;
  display?: string; // name
}

export interface EOBPrescription {
  ndcCode?: string;
  display?: string;
}

export interface EOBBillablePeriod {
  start?: string;
  end?: string;
}

export interface EOBDiagnosis {
  sequence: number;
  codeableConcept: EOBDagnosisCodeableConcept;
}

// loop through teh cdes
export interface EOBDagnosisCodeableConcept {
  codeSystem?: string;
  code?: string;
  codeType?: string; // here put ICD or whatever
  display?: string; // TODO – check to make sure the icd code is there
}

export interface EOBProcedure {
  sequence?: number;
  date?: string;
  reference?: string;
  display?: string;
  procedure?: Procedure;
}

// TODO – add code system
export interface EOBProductOrService {
  code?: string;
  codeDisplay?: string;
  system?: string;
}
