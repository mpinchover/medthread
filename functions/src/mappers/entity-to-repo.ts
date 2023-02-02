import * as entity from "../types/types";
import * as repo from "../types/repo";
export const fromEntityToRepoObservationList = (
  params: entity.Observation[]
): repo.Observation[] => {
  const observations: repo.Observation[] = [];
  params.forEach((o) => {
    const rObs = fromEntityToRepoObservation(o);
    observations.push(rObs);
  });

  return observations;
};

export const fromEntityToRepoObservation = (
  observation: entity.Observation
): repo.Observation => {
  if (!observation) return null;

  const rObservation: repo.Observation = {
    uuid: observation.uuid,
    observationSource: observation.source,
    observationStatus: observation.status,
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
  return rObservation;
};

export const fromEntityToRepoExplanationOfBenefitList = (
  params: entity.ExplanationOfBenefit[]
): repo.ExplanationOfBenefit[] => {
  const rEobs: repo.ExplanationOfBenefit[] = [];
  params.forEach((eob) => {
    const rEob = fromEntityToRepoExplanationOfBenefit(eob);
    rEobs.push(rEob);
  });

  return rEobs;
};

export const fromEntityToRepoExplanationOfBenefit = (
  explanationOfBenefit: entity.ExplanationOfBenefit
): repo.ExplanationOfBenefit => {
  let eobProvider;
  let eobPrescription;
  let eobItems;
  let eobDiagnosis;
  let eobProcedure;
  let types: string;

  if (explanationOfBenefit.provider) {
    eobProvider = JSON.stringify(explanationOfBenefit.provider);
  }
  if (explanationOfBenefit.prescription) {
    eobPrescription = JSON.stringify(explanationOfBenefit.prescription);
  }
  if (explanationOfBenefit.items) {
    eobItems = JSON.stringify(explanationOfBenefit.items);
  }

  if (explanationOfBenefit.diagnosis) {
    eobDiagnosis = JSON.stringify(explanationOfBenefit.diagnosis);
  }

  if (explanationOfBenefit.procedure) {
    eobProcedure = JSON.stringify(explanationOfBenefit.procedure);
  }

  if (explanationOfBenefit.types) {
    types = JSON.stringify(explanationOfBenefit.types);
  }

  const eob: repo.ExplanationOfBenefit = {
    uuid: explanationOfBenefit.uuid,
    userUuid: explanationOfBenefit.userUuid,
    source: explanationOfBenefit.source,
    fhirReference: explanationOfBenefit.fhirReference,
    eobStatus: explanationOfBenefit.status,
    types: types,
    eobUse: explanationOfBenefit.use,
    patientReference: explanationOfBenefit.patientReference,
    insurer: explanationOfBenefit.insurer,
    eobProvider,
    prescription: eobPrescription,
    facilityDisplay: explanationOfBenefit.facilityDisplay,
    outcome: explanationOfBenefit.outcome,
    eobItems,
    billablePeriodStart: explanationOfBenefit.billablePeriodStart,
    billablePeriodEnd: explanationOfBenefit.billablePeriodEnd,
    claimCreated: explanationOfBenefit.created,
    eobDiagnosis,
    eobProcedure,
    resourceType: explanationOfBenefit.resourceType,
    insuranceProviderUuid: explanationOfBenefit.insuranceProviderUuid,
  };
  return eob;
};

export const fromEntityToRepoCareTeamList = (
  params: entity.CareTeam[]
): repo.CareTeam[] => {
  const result: repo.CareTeam[] = [];
  params.forEach((careTeam) => {
    const rCareTeam = fromEntityToRepoCareTeam(careTeam);
    result.push(rCareTeam);
  });

  return result;
};

export const fromEntityToRepoCareTeam = (
  params: entity.CareTeam
): repo.CareTeam => {
  let participants;
  if (params.participants) {
    participants = JSON.stringify(params.participants);
  }
  const careTeam: repo.CareTeam = {
    uuid: params.uuid,
    fhirReference: params.fhirReference,
    insuranceProviderUuid: params.insuranceProviderUuid,
    source: params.source,
    userUuid: params.userUuid,
    careTeamStatus: params.status,
    participants: participants,
    resourceType: params.resourceType,
  };
  return careTeam;
};

export const fromEntityToRepoEncounterList = (
  params: entity.Encounter[]
): repo.Encounter[] => {
  const result: repo.Encounter[] = [];
  params.forEach((item) => {
    const rItem = fromEntityToRepoEncounter(item);
    result.push(rItem);
  });

  return result;
};

export const fromEntityToRepoEncounter = (
  params: entity.Encounter
): repo.Encounter => {
  const encounter: repo.Encounter = {
    uuid: params.uuid,
    fhirReference: params.fhirReference,
    insuranceProviderUuid: params.insuranceProviderUuid,
    source: params.source,
    userUuid: params.userUuid,
    encounterStatus: params.status,
    startTime: params.start,
    endTime: params.end,
    code: params.code,
    resourceType: params.resourceType,
  };
  return encounter;
};

export const fromEntityToRepoProcedureList = (
  params: entity.Procedure[]
): repo.Procedure[] => {
  const result: repo.Procedure[] = [];
  params.forEach((item) => {
    const rItem = fromEntityToRepoProcedure(item);
    result.push(rItem);
  });

  return result;
};

export const fromEntityToRepoProcedure = (
  params: entity.Procedure
): repo.Procedure => {
  const procedure: repo.Procedure = {
    uuid: params.uuid,
    fhirReference: params.fhirReference,
    insuranceProviderUuid: params.insuranceProviderUuid,
    source: params.source,
    procedureStatus: params.status,
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

export const fromEntityToRepoImmunizationList = (
  params: entity.Immunization[]
): repo.Immunization[] => {
  const result: repo.Immunization[] = [];
  params.forEach((item) => {
    const rItem = fromEntityToRepoImmunization(item);
    result.push(rItem);
  });

  return result;
};

export const fromEntityToRepoImmunization = (
  params: entity.Immunization
): repo.Immunization => {
  const imm: repo.Immunization = {
    uuid: params.uuid,
    fhirReference: params.fhirReference,
    insuranceProviderUuid: params.insuranceProviderUuid,
    source: params.source,
    immunizationStatus: params.status,
    code: params.code,
    codeDisplay: params.codeDisplay,
    occurenceDateTime: params.occurenceDateTime,
    userUuid: params.userUuid,
    resourceType: params.resourceType,
  };
  return imm;
};

export const fromEntityToRepoAllergyIntoleranceList = (
  params: entity.AllergyIntolerance[]
): repo.AllergyIntolerance[] => {
  const result: repo.AllergyIntolerance[] = [];
  params.forEach((item) => {
    const rItem = fromEntityToRepoAllergyIntolerance(item);
    result.push(rItem);
  });

  return result;
};

export const fromEntityToRepoAllergyIntolerance = (
  params: entity.AllergyIntolerance
): repo.AllergyIntolerance => {
  const al: repo.AllergyIntolerance = {
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

export const fromEntityToRepoConditionList = (
  params: entity.Condition[]
): repo.Condition[] => {
  const result: repo.Condition[] = [];
  params.forEach((item) => {
    const rItem = fromEntityToRepoCondition(item);
    result.push(rItem);
  });

  return result;
};

export const fromEntityToRepoCondition = (
  params: entity.Condition
): repo.Condition => {
  const condition: repo.Condition = {
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

export const fromEntityToRepoMedicationRequestList = (
  params: entity.MedicationRequest[]
): repo.MedicationRequest[] => {
  const result: repo.MedicationRequest[] = [];
  params.forEach((item) => {
    const rItem = fromEntityToRepoMedicationRequest(item);
    result.push(rItem);
  });

  return result;
};

export const fromEntityToRepoMedicationRequest = (
  params: entity.MedicationRequest
): repo.MedicationRequest => {
  const m: repo.MedicationRequest = {
    uuid: params.uuid,
    authoredOn: params.authoredOn,
    code: params.code,
    codeDisplay: params.codeDisplay,
    source: params.source,
    medStatus: params.status,
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

export const fromEntityToRepoMedicationDispenseList = (
  params: entity.MedicationDispense[]
): repo.MedicationDispense[] => {
  const result: repo.MedicationDispense[] = [];
  params.forEach((item) => {
    const rItem = fromEntityToRepoMedicationDispense(item);
    result.push(rItem);
  });

  return result;
};

export const fromEntityToRepoMedicationDispense = (
  params: entity.MedicationDispense
): repo.MedicationDispense => {
  const m: repo.MedicationDispense = {
    uuid: params.uuid,
    fhirReference: params.fhirReference,
    insuranceProviderUuid: params.insuranceProviderUuid,
    medStatus: params.status,
    code: params.code,
    codeDisplay: params.codeDisplay,
    dispenseType: params.type,
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
