import * as entity from "../types/types";
import * as repo from "../types/repo";

export const fromRepoToEntityObservationList = (
  params: repo.Observation[]
): entity.Observation[] => {
  const observations: entity.Observation[] = [];
  params.forEach((o) => {
    const e = fromRepoToEntityObservation(o);
    observations.push(e);
  });

  return observations;
};

export const fromRepoToEntityObservation = (
  observation: repo.Observation
): entity.Observation => {
  if (!observation) return null;

  const e: entity.Observation = {
    uuid: observation.uuid,
    source: observation.observationSource,
    status: observation.observationStatus,
    category: observation.category,
    code: observation.codeDisplay,
    codeDisplay: observation.codeDisplay,
    effectiveDateTime: observation.effectiveDateTime,
    issued: observation.issued,
    userUuid: observation.userUuid,
    fhirReference: observation.fhirReference,
    resourceType: observation.resourceType,
    insuranceProviderUuid: observation.insuranceProviderUuid,
  };
  return e;
};

export const fromRepoToEntityExplanationOfBenefitList = (
  params: repo.ExplanationOfBenefit[]
): entity.ExplanationOfBenefit[] => {
  const items: entity.ExplanationOfBenefit[] = [];
  params.forEach((o) => {
    const e = fromRepoToEntityExplanationOfBenefit(o);
    items.push(e);
  });

  return items;
};

export const fromRepoToEntityExplanationOfBenefit = (
  explanationOfBenefit: repo.ExplanationOfBenefit
): entity.ExplanationOfBenefit => {
  let eobProvider;
  let eobPrescription;
  let eobItems;
  let eobDiagnosis;
  let eobProcedure;
  let types: string[];

  if (explanationOfBenefit.eobProvider) {
    eobProvider = JSON.parse(explanationOfBenefit.eobProvider);
  }
  if (explanationOfBenefit.prescription) {
    eobPrescription = JSON.parse(explanationOfBenefit.prescription);
  }
  if (explanationOfBenefit.eobItems) {
    eobItems = JSON.parse(explanationOfBenefit.eobItems);
  }

  if (explanationOfBenefit.eobDiagnosis) {
    eobDiagnosis = JSON.parse(explanationOfBenefit.eobDiagnosis);
  }

  if (explanationOfBenefit.eobProcedure) {
    eobProcedure = JSON.parse(explanationOfBenefit.eobProcedure);
  }

  if (explanationOfBenefit.types) {
    types = JSON.parse(explanationOfBenefit.types);
  }

  const eob: entity.ExplanationOfBenefit = {
    uuid: explanationOfBenefit.uuid,
    userUuid: explanationOfBenefit.userUuid,
    source: explanationOfBenefit.source,
    fhirReference: explanationOfBenefit.fhirReference,
    status: explanationOfBenefit.eobStatus,
    types: types,
    use: explanationOfBenefit.eobUse,
    patientReference: explanationOfBenefit.patientReference,
    insurer: explanationOfBenefit.insurer,
    provider: eobProvider,
    prescription: eobPrescription,
    facilityDisplay: explanationOfBenefit.facilityDisplay,
    outcome: explanationOfBenefit.outcome,
    items: eobItems,
    billablePeriodStart: explanationOfBenefit.billablePeriodStart,
    billablePeriodEnd: explanationOfBenefit.billablePeriodEnd,
    created: explanationOfBenefit.claimCreated,
    diagnosis: eobDiagnosis,
    procedure: eobProcedure,
    resourceType: explanationOfBenefit.resourceType,
    insuranceProviderUuid: explanationOfBenefit.insuranceProviderUuid,
  };
  return eob;
};

export const fromRepoToEntityCareTeamList = (
  params: repo.CareTeam[]
): entity.CareTeam[] => {
  const result: entity.CareTeam[] = [];
  params.forEach((o) => {
    const re = fromRepoToEntityCareTeam(o);
    result.push(re);
  });

  return result;
};

export const fromRepoToEntityCareTeam = (
  params: repo.CareTeam
): entity.CareTeam => {
  let participants;
  if (params.participants) {
    participants = JSON.parse(params.participants);
  }
  const careTeam: entity.CareTeam = {
    uuid: params.uuid,
    fhirReference: params.fhirReference,
    insuranceProviderUuid: params.insuranceProviderUuid,
    source: params.source,
    userUuid: params.userUuid,
    status: params.careTeamStatus,
    participants: participants,
    resourceType: params.resourceType,
  };
  return careTeam;
};

export const fromRepoToEntityEncounterList = (
  params: repo.Encounter[]
): entity.Encounter[] => {
  const result: entity.Encounter[] = [];
  params.forEach((o) => {
    const rItem = fromRepoToEntityEncounter(o);
    result.push(rItem);
  });

  return result;
};

export const fromRepoToEntityEncounter = (
  params: repo.Encounter
): entity.Encounter => {
  const encounter: entity.Encounter = {
    uuid: params.uuid,
    fhirReference: params.fhirReference,
    insuranceProviderUuid: params.insuranceProviderUuid,
    source: params.source,
    userUuid: params.userUuid,
    status: params.encounterStatus,
    start: params.startTime,
    end: params.endTime,
    code: params.code,
    resourceType: params.resourceType,
  };
  return encounter;
};

export const fromRepoToEntityProcedureList = (
  params: repo.Procedure[]
): entity.Procedure[] => {
  const result: entity.Procedure[] = [];
  params.forEach((o) => {
    const e = fromRepoToEntityProcedure(o);
    result.push(e);
  });

  return result;
};

export const fromRepoToEntityProcedure = (
  params: repo.Procedure
): entity.Procedure => {
  const procedure: entity.Procedure = {
    uuid: params.uuid,
    fhirReference: params.fhirReference,
    insuranceProviderUuid: params.insuranceProviderUuid,
    source: params.source,
    status: params.procedureStatus,
    code: params.code,
    codeDisplay: params.codeDisplay,
    performedDateTime: params.performedDateTime,
    recorder: params.recorder,
    recorderIdentifier: params.recorderIdentifier,
    performer: params.performer,
    performerIdentifier: params.performerIdentifier,
    userUuid: params.userUuid,
    resourceType: params.resourceType,
  };
  return procedure;
};

export const fromRepoToEntityImmunizationList = (
  params: repo.Immunization[]
): entity.Immunization[] => {
  const result: entity.Immunization[] = [];
  params.forEach((o) => {
    const e = fromRepoToEntityImmunization(o);
    result.push(e);
  });

  return result;
};

export const fromRepoToEntityImmunization = (
  params: repo.Immunization
): entity.Immunization => {
  const imm: entity.Immunization = {
    uuid: params.uuid,
    fhirReference: params.fhirReference,
    insuranceProviderUuid: params.insuranceProviderUuid,
    source: params.source,
    status: params.immunizationStatus,
    code: params.code,
    codeDisplay: params.codeDisplay,
    occurenceDateTime: params.occurenceDateTime,
    userUuid: params.userUuid,
    resourceType: params.resourceType,
  };
  return imm;
};

export const fromRepoToEntityAllergyIntoleranceList = (
  params: repo.AllergyIntolerance[]
): entity.AllergyIntolerance[] => {
  const result: entity.AllergyIntolerance[] = [];
  params.forEach((o) => {
    const e = fromRepoToEntityAllergyIntolerance(o);
    result.push(e);
  });

  return result;
};

export const fromRepoToEntityAllergyIntolerance = (
  params: repo.AllergyIntolerance
): entity.AllergyIntolerance => {
  const al: entity.AllergyIntolerance = {
    uuid: params.uuid,
    fhirReference: params.fhirReference,
    insuranceProviderUuid: params.insuranceProviderUuid,
    source: params.source,
    clinicalStatus: params.clinicalStatus,
    verificationStatus: params.verificationStatus,
    code: params.code,
    codeDisplay: params.codeDisplay,
    onsetDateTime: params.onsetDateTime,
    recordedDate: params.recordedDate,
    recorder: params.recorder,
    asserter: params.asserter,
    reactionManifestation: params.reactionManifestation,
    recorderIdentifier: params.recorderIdentifier,
    asserterIdentifier: params.asserterIdentifier,
    userUuid: params.userUuid,
    resourceType: params.resourceType,
  };
  return al;
};

export const fromRepoToEntityConditionList = (
  params: repo.Condition[]
): entity.Condition[] => {
  const result: entity.Condition[] = [];
  params.forEach((o) => {
    const e = fromRepoToEntityCondition(o);
    result.push(e);
  });

  return result;
};

export const fromRepoToEntityCondition = (
  params: repo.Condition
): entity.Condition => {
  const condition: entity.Condition = {
    uuid: params.uuid,
    fhirReference: params.fhirReference,
    insuranceProviderUuid: params.insuranceProviderUuid,
    source: params.source,
    clinicalStatus: params.clinicalStatus,
    verificationStatus: params.verificationStatus,
    category: params.category,
    code: params.code,
    codeDisplay: params.codeDisplay,
    userUuid: params.userUuid,
    resourceType: params.resourceType,
  };
  return condition;
};

export const fromRepoToEntityMedicationRequestList = (
  params: repo.MedicationRequest[]
): entity.MedicationRequest[] => {
  const result: entity.MedicationRequest[] = [];
  params.forEach((o) => {
    const e = fromRepoToEntityMedicationRequest(o);
    result.push(e);
  });

  return result;
};

export const fromRepoToEntityMedicationRequest = (
  params: repo.MedicationRequest
): entity.MedicationRequest => {
  const m: entity.MedicationRequest = {
    uuid: params.uuid,
    authoredOn: params.authoredOn,
    code: params.code,
    codeDisplay: params.codeDisplay,
    source: params.source,
    status: params.medStatus,
    intent: params.intent,
    requesterIdentifier: params.requesterIdentifier,
    requester: params.requester,
    dosageInstructionText: params.dosageInstructionText,
    dosageInstructionRoute: params.dosageInstructionRoute,
    doseAndRateQuantityValue: params.doseAndRateQuantityValue,
    doseAndRateQuantityUnit: params.doseAndRateQuantityUnit,
    fhirReference: params.fhirReference,
    insuranceProviderUuid: params.insuranceProviderUuid,
    userUuid: params.userUuid,
    resourceType: params.resourceType,
  };
  return m;
};

export const fromRepoToEntityMedicationDispenseList = (
  params: repo.MedicationDispense[]
): entity.MedicationDispense[] => {
  const result: entity.MedicationDispense[] = [];
  params.forEach((item) => {
    const e = fromRepoToEntityMedicationDispense(item);
    result.push(e);
  });

  return result;
};

export const fromRepoToEntityMedicationDispense = (
  params: repo.MedicationDispense
): entity.MedicationDispense => {
  const m: entity.MedicationDispense = {
    uuid: params.uuid,
    fhirReference: params.fhirReference,
    insuranceProviderUuid: params.insuranceProviderUuid,
    status: params.medStatus,
    code: params.code,
    codeDisplay: params.codeDisplay,
    type: params.dispenseType,
    quantityValue: params.quantityValue,
    quantityUnit: params.quantityUnit,
    daysSupply: params.daysSupply,
    whenHandedOver: params.whenHandedOver,
    intent: params.intent,
    source: params.source,
    userUuid: params.userUuid,
    resourceType: params.resourceType,
  };
  return m;
};
