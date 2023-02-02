export interface AuthorizedCareProviderLink {
  careProviderUuid?: string;
  careProviderEmail?: string;
  patientUuid?: string;
  providerName?: string;
  uuid?: string;
}

export interface Medication {
  uuid?: string;
  dateStarted?: Date;
  medicationName?: string;
  source?: string;
  fhirReference?: string;
  insuranceProviderUuid?: string;
}

// TODO - move to types
export interface DerivedMedicationHistory {
  date?: Date;
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
  lastRequestedOn?: Date;
  firstRequestedOn?: Date;
  lastFillOn?: Date;
  firstFillOn?: Date;
  code?: string; // you can get the patient input from this code, so have like a patient modification, by code
  codeDisplay?: string;
  request?: MedicationRequest[];
  dispense?: MedicationDispense[];
  // quantity?: number; // if med dispense doesn't have it then use med request
  // daysSupply?: number; // if med dispense doesn't have it then use med request
  // dosage?: string;
  source?: string; // if the patient has modified the derived me by the code then should be claims + patient
  derivedMedicationHistory: DerivedMedicationHistory[];
  resourceType?: string;
}

export interface MedicationRequest {
  uuid?: string;
  authoredOn?: Date; // when request was made
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
  insuranceProviderUuid?: string;
  userUuid?: string;
  primaryDate?: Date;
  resourceType?: string;
}

export interface MedicationDispense {
  uuid?: string;
  fhirReference?: string;
  insuranceProviderUuid?: string;
  status?: string;
  code?: string;
  codeDisplay?: string;
  type?: string;
  quantityValue?: number; // just quantity
  quantityUnit?: string; // just quantity
  daysSupply?: number;
  whenHandedOver?: Date;
  intent?: string;
  source?: string;
  userUuid?: string;
  primaryDate?: Date;
  resourceType?: string;
}

export interface AllergyIntolerance {
  uuid?: string;
  fhirReference?: string;
  insuranceProviderUuid?: string;
  source?: string;
  clinicalStatus?: string;
  verificationStatus?: string;
  code?: string; // the code of what is causing the reaction
  codeDisplay?: string; // the name of the item
  onsetDateTime?: Date;
  recordedDate?: Date;
  recorder?: string;
  asserter?: string;
  reactionManifestation?: string;
  recorderIdentifier?: string;
  asserterIdentifier?: string;
  userUuid?: string;
  primaryDate?: Date;
  resourceType?: string;
}

export interface Condition {
  uuid?: string;
  fhirReference?: string;
  insuranceProviderUuid?: string;
  source?: string;
  clinicalStatus?: string;
  verificationStatus?: string;
  category?: string;
  code?: string;
  codeDisplay?: string; // the condition
  userUuid?: string;
  primaryDate?: Date;
  resourceType?: string;
}

export interface Immunization {
  uuid?: string;
  fhirReference?: string;
  insuranceProviderUuid?: string;
  source?: string;
  status?: string;
  code?: string;
  codeDisplay?: string; // the vaccine display
  occurenceDateTime?: Date;
  userUuid?: string;
  primaryDate?: Date;
  resourceType?: string;
}

export interface Procedure {
  uuid?: string;
  fhirReference?: string;
  insuranceProviderUuid?: string;
  source?: string;
  status?: string;
  code?: string;
  codeDisplay?: string; // the procedure display
  performedDateTime?: Date;
  recorder?: string;
  recorderIdentifier?: string;
  performer?: string;
  performerIdentifier?: string; // NPI code
  userUuid?: string;
  primaryDate?: Date;
  resourceType?: string;
}

export interface Encounter {
  uuid?: string;
  fhirReference?: string;
  insuranceProviderUuid?: string;
  source?: string;
  userUuid?: string;
  status?: string;
  start?: Date;
  end?: Date;
  code?: string;
  primaryDate?: Date;
  resourceType?: string;
}

export interface CareTeamParticipant {
  roleCode?: string;
  roleCodeDisplay?: string;
  memberCode?: string;
  memberCodeDisplay?: string;
}

export interface CareTeam {
  uuid?: string;
  fhirReference?: string;
  insuranceProviderUuid?: string;
  source?: string;
  userUuid?: string;
  status?: string;
  participants?: CareTeamParticipant[];
  primaryDate?: Date;
  resourceType?: string;
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
  uuid?: string;
  source?: string;
  status?: string;
  category?: string;
  code?: string;
  codeDisplay?: string;
  effectiveDateTime?: Date;
  issued?: Date;
  userUuid?: string;
  fhirReference?: string;
  primaryDate?: Date;
  resourceType?: string;
  insuranceProviderUuid?: string;
}

export interface Profile {
  authUid?: string; // firebase auth link
  uuid?: string;
  userRole?: string;
  nameValue?: string;
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
  userUuid: string;
  accessToken: string;
  providerName: string;
  // providerCode: string;
  uuid?: string;
  capabilities: string[];
}

export interface Account {
  insuranceProviders: InsuranceProvider[];
  healthcareProviders?: AuthorizedCareProviderLink[];
}

export interface InsuranceMetadata {
  publisher: string;
  capabilities: string[];
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
  userUuid?: string;
}

// TODO
// use npi code api?
// https://clinicaltables.nlm.nih.gov/apidoc/npi_org/v3/doc.html
export interface ExplanationOfBenefit {
  uuid?: string;
  userUuid?: string;
  source?: string;
  jsonResponse?: string;
  fhirReference?: string;
  status?: string;
  types?: string[];
  use?: string;
  patientReference?: string;
  insurer?: string;
  provider?: EOBProvider;
  prescription?: EOBPrescription;
  facilityDisplay?: string;
  outcome?: string;
  items?: EOBItem[];
  billablePeriodStart?: Date;
  billablePeriodEnd?: Date;
  created?: Date;
  diagnosis?: EOBDiagnosis[];
  procedure?: EOBProcedure[];
  primaryDate?: Date;
  resourceType?: string;
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

// export interface EOBBillablePeriod {
//   start?: string;
//   end?: string;
// }

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
  date?: Date;
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
