export interface CareTeam {
  uuid?: string;
  fhirReference?: string;
  insuranceProviderUuid?: string;
  source?: string;
  userUuid?: string;
  careTeamStatus?: string;
  participants?: string;
  resourceType?: string;
}

export interface Observation {
  uuid?: string;
  source?: string;
  observationStatus?: string;
  observationSource?: string;
  category?: string;
  code?: string;
  codeDisplay?: string;
  effectiveDateTime?: Date;
  issued?: Date;
  userUuid?: string;
  fhirReference?: string;
  resourceType?: string;
  insuranceProviderUuid?: string;
}

export interface ExplanationOfBenefit {
  uuid?: string;
  userUuid?: string;
  source?: string;
  fhirReference?: string;
  eobStatus?: string;
  types?: string;
  eobUse?: string;
  patientReference?: string;
  insurer?: string;
  eobProvider?: string;
  prescription?: string;
  facilityDisplay?: string;
  outcome?: string;
  eobItems?: string;
  billablePeriodStart?: Date;
  billablePeriodEnd?: Date;
  claimCreated?: Date;
  eobDiagnosis?: string;
  eobProcedure?: string;
  resourceType?: string;
  insuranceProviderUuid?: string;
}

export interface MedicationRequest {
  uuid?: string;
  authoredOn?: Date; // when request was made
  code?: string;
  codeDisplay?: string;
  source?: string;
  medStatus?: string;
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
  resourceType?: string;
}

export interface MedicationDispense {
  uuid?: string;
  fhirReference?: string;
  insuranceProviderUuid?: string;
  medStatus?: string;
  code?: string;
  codeDisplay?: string;
  dispenseType?: string;
  quantityValue?: number; // just quantity
  quantityUnit?: string; // just quantity
  daysSupply?: number;
  whenHandedOver?: Date;
  intent?: string;
  source?: string;
  userUuid?: string;
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
  resourceType?: string;
}

export interface Immunization {
  uuid?: string;
  fhirReference?: string;
  insuranceProviderUuid?: string;
  source?: string;
  immunizationStatus?: string;
  code?: string;
  codeDisplay?: string; // the vaccine display
  occurenceDateTime?: Date;
  userUuid?: string;
  resourceType?: string;
}

export interface Procedure {
  uuid?: string;
  fhirReference?: string;
  insuranceProviderUuid?: string;
  source?: string;
  procedureStatus?: string;
  code?: string;
  codeDisplay?: string; // the procedure display
  performedDateTime?: Date;
  recorder?: string;
  recorderIdentifier?: string;
  performer?: string;
  performerIdentifier?: string; // NPI code
  userUuid?: string;
  resourceType?: string;
}

export interface Encounter {
  uuid?: string;
  fhirReference?: string;
  insuranceProviderUuid?: string;
  source?: string;
  userUuid?: string;
  encounterStatus?: string;
  startTime?: Date;
  endTime?: Date;
  code?: string;
  resourceType?: string;
}
