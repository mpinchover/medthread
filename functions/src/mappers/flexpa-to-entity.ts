import {
  Medication,
  AllergyIntolerance,
  MedicationRequest,
  MedicationDispense,
  Condition,
  Procedure,
  Immunization,
  Encounter,
  CareTeamParticipant,
  Observation,
  CareTeam,
  ExplanationOfBenefit,
  EOBType,
  EOBProvider,
  EOBPrescription,
  EOBItem,
  EOBProductOrService,
  EOBDagnosisCodeableConcept,
  EOBDiagnosis,
  EOBProcedure,
  // EOBBillablePeriod,
} from "../types";

import * as constants from "../config/constants";

export const setEOBPrimaryDate = (eob: ExplanationOfBenefit) => {
  if (eob?.billablePeriodStart) {
    eob.primaryDate = eob.billablePeriodStart;
  } else if (eob.created) {
    eob.primaryDate = eob.created;
  } else if (eob.procedure?.length > 0) {
    eob.procedure.forEach((procedure) => {
      if (procedure.date) {
        eob.primaryDate = procedure.date;
      }
    });
  }
};
export const setEncounterPrimaryDate = (encounter: Encounter) => {
  if (encounter.start) encounter.primaryDate = encounter.start;
};

export const setProcedurePrimaryDate = (procedure: Procedure) => {
  if (procedure.performedDateTime)
    procedure.primaryDate = procedure.performedDateTime;
};

export const fromFlexpaToEntityEOBList = (
  flexpaEOBList: any[]
): ExplanationOfBenefit[] => {
  const entityEOBList: ExplanationOfBenefit[] = [];

  for (let i = 0; i < flexpaEOBList.length; i++) {
    const eob = fromFlexpaToEntityEOB(flexpaEOBList[i]);
    entityEOBList.push(eob);
  }

  return entityEOBList;
};

// TODO – can you query provider by npi code
export const fromFlexpaToEntityEOB = (params: any) => {
  let billablePeriodStart = params.resource?.billablePeriod?.start;
  if (billablePeriodStart) {
    billablePeriodStart = new Date(billablePeriodStart);
  }
  let billablePeriodEnd = params.resource?.billablePeriod?.end;
  if (billablePeriodEnd) {
    billablePeriodEnd = new Date(billablePeriodEnd);
  }
  const eob: ExplanationOfBenefit = {
    resourceType: constants.EXPLANATION_OF_BENEFIT,
    source: constants.CLAIMS,
    fhirReference: params.resource?.id,
    jsonResponse: JSON.stringify(params),
    status: params.resource?.status,
    types: fromFlexpaToEntityEOBType(params.resource?.type?.coding),
    use: params.resource?.use,
    created: params.resource?.created,
    insurer: params.resource?.insurer?.display,
    provider: fromFlexpaToEntityEOBProvider(params.resource?.provider),
    prescription: fromFlexpaToEntityEOBPrescription(
      params.resource?.prescription
    ),
    facilityDisplay: params.resource?.facility?.display,
    outcome: params.resource?.outcome,
    items: fromFlexpaToEntityItems(params.resource?.item),
    diagnosis: fromFlexpaToEntityDiagnosis(params.resource?.diagnosis),
    procedure: fromFlexpaToEntityEOBProcedure(params.resource?.procedure),
    billablePeriodStart,
    billablePeriodEnd,
  };

  return eob;
};

export const fromFlexpaToEntityEOBProcedure = (
  procedure: any
): EOBProcedure[] => {
  if (!procedure) return null;

  const eobProcedures: EOBProcedure[] = [];
  procedure.forEach((p: any) => {
    let date;
    if (p.date) {
      date = new Date(p.date);
    }
    const eobProcedure: EOBProcedure = {
      sequence: p.sequence,
      date,
      display: p.procedureReference?.display,
      reference: p.procedureReference?.reference,
    };
    eobProcedures.push(eobProcedure);
  });
  return eobProcedures;
};

export const fromFlexpaToEntityDiagnosis = (
  diagnosisList: any
): EOBDiagnosis[] => {
  if (!diagnosisList) return null;

  const entityDiagnosisItems: EOBDiagnosis[] = [];
  // for now just get the fisrst coded object
  diagnosisList.forEach((diagnosis: any) => {
    const eobDiagnosis: EOBDiagnosis = {
      sequence: diagnosis.sequence,
      codeableConcept: fromFlexpaToEntityDiagnosisCodableConcept(
        diagnosis.diagnosisCodeableConcept
      ),
    };
    entityDiagnosisItems.push(eobDiagnosis);
  });

  return entityDiagnosisItems;
};

export const fromFlexpaToEntityDiagnosisCodableConcept = (
  diagnosisCodeableConcept: any
): EOBDagnosisCodeableConcept => {
  if (!diagnosisCodeableConcept) return null;

  const codeableConcept: EOBDagnosisCodeableConcept = {
    codeSystem: diagnosisCodeableConcept.coding?.[0].system,
    code: diagnosisCodeableConcept.coding?.[0]?.code,
    display: diagnosisCodeableConcept.coding?.[0]?.display,
  };

  return codeableConcept;
};

export const fromFlexpaToEntityItems = (items: any): EOBItem[] => {
  if (!items) return null;

  const eobItems: EOBItem[] = [];
  items.forEach((item: any) => {
    const eobItem: EOBItem = {
      sequence: item.sequence,
      productOrService: fromFlexpaToEntityProductOrService(
        item.productOrService.coding
      ),
    };
    eobItems.push(eobItem);
  });
  return eobItems;
};

export const fromFlexpaToEntityProductOrService = (
  coding: any
): EOBProductOrService[] => {
  if (!coding) return null;

  const entityEOBProductOrService: EOBProductOrService[] = [];
  coding.forEach((code: any) => {
    const pos: EOBProductOrService = {
      system: code.system,
      code: code.code,
      codeDisplay: code.display,
    };
    entityEOBProductOrService.push(pos);
  });
  return entityEOBProductOrService;
};

export const fromFlexpaToEntityEOBPrescription = (
  params: any
): EOBPrescription => {
  if (!params) return null;

  // TODO add system
  const eobPrescription: EOBPrescription = {
    ndcCode: params.identifier?.value,
    display: params.display,
  };
  return eobPrescription;
};

export const fromFlexpaToEntityEOBProvider = (params: any): EOBProvider => {
  if (!params) return null;

  const entityEOBProvider: EOBProvider = {
    npiCode: params.identifier?.value,
    display: params.display,
  };
  return entityEOBProvider;
};

export const fromFlexpaToEntityEOBType = (params: any): string[] => {
  if (!params) return null;

  const eobTypes: string[] = [];
  params.forEach((code: any) => {
    if (code?.code) {
      eobTypes.push(code.code);
    }
  });

  return eobTypes;
};

//medication requests
export const fromFlexpaToEntityMedicationRequestList = (
  flexpaMedicationRequestList: any[]
): MedicationRequest[] => {
  const entityMedicationRequestList: MedicationRequest[] = [];

  for (let i = 0; i < flexpaMedicationRequestList.length; i++) {
    const flexpaMedReq = flexpaMedicationRequestList[i];
    const entityMedReq = fromFlexpaToEntityMedicationRequest(flexpaMedReq);
    entityMedicationRequestList.push(entityMedReq);
  }
  return entityMedicationRequestList;
};
// TODO – clean up extra white space in codeDisplay
export const fromFlexpaToEntityMedicationRequest = (
  params: any
): MedicationRequest => {
  const medicationRequest: MedicationRequest = {
    resourceType: constants.MEDICATION_REQUEST,
    source: constants.CLAIMS,
  };

  let fhirReference = params.resource?.id;
  if (fhirReference) medicationRequest.fhirReference = fhirReference;

  let status = params.resource?.status;
  if (status) medicationRequest.status = status;

  let intent = params.resource?.intent;
  if (intent) medicationRequest.intent = intent;

  let code = params.resource?.medicationCodeableConcept?.coding?.[0]?.code;
  if (code) medicationRequest.code = code;

  let codeDisplay =
    params.resource?.medicationCodeableConcept?.coding?.[0]?.display;
  if (!codeDisplay)
    codeDisplay = params.resource?.medicationCodeableConcept?.coding?.text;
  if (codeDisplay) medicationRequest.codeDisplay = codeDisplay;

  let authoredOn = params.resource?.authoredOn;
  if (authoredOn) medicationRequest.authoredOn = new Date(authoredOn);
  if (authoredOn) medicationRequest.primaryDate = new Date(authoredOn);

  let requesterIdentifier = params.resource?.requester?.identifier?.value;
  if (requesterIdentifier)
    medicationRequest.requesterIdentifier = requesterIdentifier;

  let requester = params.resource?.requester?.display;
  if (requester) medicationRequest.requester = requester;

  let dosageInstructionText = params.resource?.dosageInstruction?.[0]?.text;
  if (dosageInstructionText)
    medicationRequest.dosageInstructionText = dosageInstructionText;

  let dosageInstructionRoute =
    params.resource?.dosageInstruction?.[0]?.route?.text;
  if (dosageInstructionRoute)
    medicationRequest.dosageInstructionRoute = dosageInstructionRoute;

  let doseAndRateQuantityValue =
    params.resource?.dosageInstruction?.[0]?.doseAndRate?.[0]?.doseQuantity
      ?.value;
  if (doseAndRateQuantityValue)
    medicationRequest.doseAndRateQuantityValue = doseAndRateQuantityValue;

  let doseAndRateQuantityUnit =
    params.resource?.dosageInstruction?.[0]?.doseAndRate?.[0]?.doseQuantity
      ?.unit;
  if (doseAndRateQuantityUnit)
    medicationRequest.doseAndRateQuantityUnit = doseAndRateQuantityUnit;

  return medicationRequest;
};

// allergies
export const fromFlexpaToEntityAllergyIntoleranceList = (
  flexpaAllergyIntoleranceList: any[]
): AllergyIntolerance[] => {
  const entityAllergyIntoleranceList: AllergyIntolerance[] = [];
  for (let i = 0; i < flexpaAllergyIntoleranceList.length; i++) {
    const entityAllergyIntolerance = fromFlexpaToEntityAllergyIntolerance(
      flexpaAllergyIntoleranceList[i]
    );
    entityAllergyIntoleranceList.push(entityAllergyIntolerance);
  }
  return entityAllergyIntoleranceList;
};

export const fromFlexpaToEntityAllergyIntolerance = (
  params: any
): AllergyIntolerance => {
  const allergyIntolerance: AllergyIntolerance = {
    resourceType: constants.ALLERGY_INTOLERANCE,
    source: constants.CLAIMS,
  };

  let clinicalStatus = params.resource?.clinicalStatus?.coding?.[0]?.code;
  if (clinicalStatus) allergyIntolerance.clinicalStatus = clinicalStatus;

  let verificationStatus =
    params.resource?.verificationStatus?.coding?.[0]?.code;
  if (verificationStatus)
    allergyIntolerance.verificationStatus = verificationStatus;

  let code = params.resource?.code?.coding?.[0]?.code;
  if (code) allergyIntolerance.code = code;

  let codeDisplay = params.resource?.code?.text;
  if (!codeDisplay) codeDisplay = params.resource?.code?.coding?.[0]?.display;
  if (codeDisplay) allergyIntolerance.codeDisplay = codeDisplay;

  let onsetDateTime = params.reousrce?.onsetDateTime;
  if (onsetDateTime) allergyIntolerance.onsetDateTime = new Date(onsetDateTime);

  let recordedDate = params.resource?.recordedDate;
  if (recordedDate) allergyIntolerance.recordedDate = new Date(recordedDate);

  if (onsetDateTime) {
    allergyIntolerance.primaryDate = new Date(onsetDateTime);
  } else if (recordedDate) {
    allergyIntolerance.primaryDate = new Date(recordedDate);
  }

  let recorder = params.resource?.recorder?.display;
  if (recorder) allergyIntolerance.recorder = recorder;

  let recorderIdentifier = params.resource?.recorder.identifier?.value;
  if (recorderIdentifier)
    allergyIntolerance.recorderIdentifier = recorderIdentifier;

  let asserter = params.resource?.asserter?.display;
  if (asserter) allergyIntolerance.asserter = asserter;

  let asserterIdentifier = params.resource?.asserter.identifier?.value;
  if (asserterIdentifier)
    allergyIntolerance.asserterIdentifier = asserterIdentifier;

  let reactionManifestation =
    params.resource?.reaction?.[0]?.manifestation?.[0]?.text;
  if (reactionManifestation)
    allergyIntolerance.reactionManifestation = reactionManifestation;

  let fhirReference = params.resource?.id;
  if (fhirReference) allergyIntolerance.fhirReference = fhirReference;

  return allergyIntolerance;
};

// conditions
export const fromFlexpaToEntityConditionList = (flexpaConditionList: any[]) => {
  const entityConditionList: Condition[] = [];

  for (let i = 0; i < flexpaConditionList.length; i++) {
    const fCondition = flexpaConditionList[i];
    const eCondition = fromFlexpaToEntityCondition(fCondition);
    entityConditionList.push(eCondition);
  }
  return entityConditionList;
};

// TODO -  conditions can have multiple codes
export const fromFlexpaToEntityCondition = (params: any): Condition => {
  const condition: Condition = {
    resourceType: constants.CONDITION,
    source: constants.CLAIMS,
  };
  let fhirReference = params.resource?.id;
  if (fhirReference) condition.fhirReference = fhirReference;

  let clinicalStatus = params.resource?.clinicalStatus?.coding?.[0]?.code;
  if (clinicalStatus) condition.clinicalStatus = clinicalStatus;

  let verificationStatus =
    params.resource?.verificationStatus?.coding?.[0]?.code;
  if (verificationStatus) condition.verificationStatus = verificationStatus;

  let category = params.resource?.category?.[0]?.coding?.display;
  if (category) condition.category = category;

  let code = params.resource?.code?.coding?.[0].code;
  if (code) condition.code = code;

  let codeDisplay = params.resource?.code?.text;
  if (!codeDisplay) codeDisplay = params.resource?.code?.coding?.[0]?.display;
  if (codeDisplay) condition.codeDisplay = codeDisplay;

  return condition;
};

//procedures
export const fromFlexpaToEntityProcedureList = (flexpaProcedureList: any[]) => {
  const entityProcedureList: Procedure[] = [];

  for (let i = 0; i < flexpaProcedureList.length; i++) {
    const fProcedure = flexpaProcedureList[i];

    const eProcedure = fromFlexpaToEntityProcedure(fProcedure);
    entityProcedureList.push(eProcedure);
  }
  return entityProcedureList;
};

// TODO – just dont save null values to Firestore
// use fallbacks for resource code
export const fromFlexpaToEntityProcedure = (params: any): Procedure => {
  const procedure: Procedure = {
    source: constants.CLAIMS,
    resourceType: constants.PROCEDURE,
  };

  let fhirReference = params.resource?.id;
  if (fhirReference) procedure.fhirReference = fhirReference;

  let status = params.resource.status;
  if (status) procedure.status = status;

  let code = params.resource?.code?.coding?.[0].code;
  if (code) procedure.code = code;

  let codeDisplay = params.resource?.code?.text;
  if (!codeDisplay) codeDisplay = params.resource?.code?.coding?.[0]?.display;
  if (codeDisplay) procedure.codeDisplay = codeDisplay;

  let performedDateTime = params.resource?.performedDateTime;
  if (performedDateTime)
    procedure.performedDateTime = new Date(performedDateTime);
  if (performedDateTime) procedure.primaryDate = new Date(performedDateTime);

  let recorder = params.resource?.recorder?.display;
  if (recorder) procedure.recorder = recorder;

  let recorderIdentifier = params.resource?.recorder?.identifier?.value;
  if (recorderIdentifier) procedure.recorderIdentifier = recorderIdentifier;

  let performer = params.resource?.performer?.display;
  if (performer) procedure.performer = performer;

  let performerIdentifier = params.resource?.performer?.identifier?.value;
  if (performerIdentifier) procedure.performerIdentifier = performerIdentifier;

  return procedure;
};

export const fromFlexpaReferenceProcedureToEntityProcedure = (
  params: any
): Procedure => {
  const procedure: Procedure = {
    source: constants.CLAIMS,
    resourceType: constants.PROCEDURE,
    fhirReference: params.id,
    code: params.code?.coding?.[0].code,
    performedDateTime: params.performedPeriod?.start,
    performerIdentifier: params.performer?.[0]?.actor?.identifier?.value,
    performer: params.performer?.[0]?.actor?.display,
  };

  let codeDisplay = params.code?.coding?.[0].display;
  if (!codeDisplay) codeDisplay = params.code?.text;
  procedure.codeDisplay = codeDisplay;
  return procedure;
};

//immunization
export const fromFlexpaToEntityImmunizationList = (
  flexpaImmunizationList: any[]
): Immunization[] => {
  const entityImmunizationList: Immunization[] = [];

  for (let i = 0; i < flexpaImmunizationList.length; i++) {
    const fImmunization = flexpaImmunizationList[i];

    // could be more than one vaccine code, I guess they may have done
    // more than 1 vaccine at the appt?
    const vaccineCodes = fImmunization.vaccineCode?.coding;
    if (!vaccineCodes) continue;

    for (let j = 0; j < vaccineCodes.length; j++) {
      const vCode = vaccineCodes[j];
      const eImmunization = fromFlexpaToEntityImmunization(
        fImmunization,
        vCode
      );
      entityImmunizationList.push(eImmunization);
    }
  }

  return entityImmunizationList;
};

// TODO – handle the same code issue here with every other claims data
export const fromFlexpaToEntityImmunization = (
  params: any,
  vCode: any
): Immunization => {
  const immunization: Immunization = {
    source: constants.CLAIMS,
    resourceType: constants.IMMUNIZATION,
  };

  const code = vCode.code;
  if (code) immunization.code = code;

  const codeDisplay = vCode.display;
  if (codeDisplay) immunization.codeDisplay = codeDisplay;

  const status = params.status;
  if (status) immunization.status = status;

  const occurenceDateTime = params.occurenceDateTime;
  if (occurenceDateTime)
    immunization.occurenceDateTime = new Date(occurenceDateTime);
  if (occurenceDateTime) immunization.primaryDate = new Date(occurenceDateTime);

  return immunization;
};

//medication dispense
export const fromFlexpaToEntityMedicationDispenseList = (
  flexpaMedicationDispenseList: any[]
): MedicationDispense[] => {
  const entityMedicationDispenseList: MedicationDispense[] = [];

  for (let i = 0; i < flexpaMedicationDispenseList.length; i++) {
    const medDispense = flexpaMedicationDispenseList[i];
    const entityMedDispense = fromFlexpaToEntityMedicationDispense(medDispense);
    entityMedicationDispenseList.push(entityMedDispense);
  }
  return entityMedicationDispenseList;
};

export const fromFlexpaToEntityMedicationDispense = (
  params: any
): MedicationDispense => {
  const medicationDispense: MedicationDispense = {
    source: constants.CLAIMS,
    resourceType: constants.MEDICATION_DISPENSE,
  };

  let fhirReference = params.resource?.id;
  if (fhirReference) medicationDispense.fhirReference = fhirReference;

  let status = params.resource?.status;
  if (status) medicationDispense.status = status;

  let intent = params.resource?.intent;
  if (intent) medicationDispense.intent = intent;

  let code = params.resource?.medicationCodeableConcept?.coding?.[0].code;
  if (code) medicationDispense.code = code;

  let codeDisplay =
    params.resource?.medicationCodeableConcept?.coding?.[0]?.display;
  if (!codeDisplay)
    codeDisplay = params.resource?.medicationCodeableConcept?.text;
  if (codeDisplay) medicationDispense.codeDisplay = codeDisplay;

  let type = params.resource?.type?.coding?.[0]?.code;
  if (type) medicationDispense.type = type;

  let quantityValue = params.resource?.quantity?.value;
  if (quantityValue) medicationDispense.quantityValue = quantityValue;

  let quantityUnit = params.resource?.quantity?.unit;
  if (quantityUnit) medicationDispense.quantityUnit = quantityUnit;

  let daysSupply = params.resource?.daysSupply?.value;
  if (daysSupply) medicationDispense.daysSupply = daysSupply;

  let whenHandedOver = params.resource?.whenHandedOver;
  if (whenHandedOver)
    medicationDispense.whenHandedOver = new Date(whenHandedOver);
  if (whenHandedOver) medicationDispense.primaryDate = new Date(whenHandedOver);

  return medicationDispense;
};

export const fromFlexpaToEntityEncounterList = (
  flexpaMedicationDispenseList: any[]
): Encounter[] => {
  const entityEncounterList: Encounter[] = [];

  for (let i = 0; i < flexpaMedicationDispenseList.length; i++) {
    const encounter = flexpaMedicationDispenseList[i];
    const entityEncounter = fromFlexpaToEntityEncounter(encounter);
    entityEncounterList.push(entityEncounter);
  }
  return entityEncounterList;
};

export const fromFlexpaToEntityEncounter = (params: any) => {
  const encounter: Encounter = {
    source: constants.CLAIMS,
    fhirReference: params.fhirReference,
    resourceType: constants.ENCOUNTER,
  };

  if (params.resource?.status) {
    encounter.status = params.resource.status;
  }

  if (params.resource?.period?.start) {
    encounter.start = new Date(params.resource.period?.start);
  }
  if (params.resource?.period?.start) {
    encounter.primaryDate = new Date(params.resource?.period?.start);
  }
  if (params.resource?.period?.end) {
    encounter.end = new Date(params.resource.period?.end);
  }

  if (params.resource?.class?.code) {
    encounter.code = params.resource.class?.code;
  }

  return encounter;
};

export const fromFlexpaToEntityCareTeamList = (
  flexpaCareTeamList: any[]
): CareTeam[] => {
  const entityCareTeamList: Encounter[] = [];

  for (let i = 0; i < flexpaCareTeamList.length; i++) {
    const careTeam = flexpaCareTeamList[i];
    const entityCareTeam = fromFlexpaToEntityCareTeam(careTeam);
    entityCareTeamList.push(entityCareTeam);
  }
  return entityCareTeamList;
};

export const fromFlexpaToEntityCareTeam = (params: any) => {
  const careTeam: CareTeam = {
    source: constants.CLAIMS,
    fhirReference: params.fhirReference,
    resourceType: constants.CARE_TEAM,
  };

  if (params.resource?.status) careTeam.status = params.resource?.status;

  if (params.resource?.participants) {
    careTeam.participants = fromFlexpaToEntityCareTeamParticipants(
      params.resource?.participants
    );
  }
  return careTeam;
};

export const fromFlexpaToEntityCareTeamParticipants = (participants: any) => {
  const entityCareTeamParticipants: CareTeamParticipant[] = [];

  participants.forEach((participant: any) => {
    const eParticipant = fromFlexpaToEntityCareTeamParticipant(participant);
    entityCareTeamParticipants.push(eParticipant);
  });
  return entityCareTeamParticipants;
};

// TODO – handle more than one role?
export const fromFlexpaToEntityCareTeamParticipant = (participant: any) => {
  const careTeamParticpiant: CareTeamParticipant = {};

  const roleCode = participant.role?.[0]?.coding?.[0]?.code;
  if (roleCode) {
    careTeamParticpiant.roleCode = roleCode;
  }

  const roleDisplay = participant.role?.[0]?.coding?.[0]?.display;
  if (roleDisplay) {
    careTeamParticpiant.roleCodeDisplay = roleDisplay;
  }

  const memberCode = participant.member?.identifier?.value;
  if (memberCode) {
    careTeamParticpiant.memberCode = memberCode;
  }

  const memberCodeDisplay = participant.member?.display;
  if (memberCodeDisplay) {
    careTeamParticpiant.memberCodeDisplay = memberCodeDisplay;
  }

  return careTeamParticpiant;
};

export const fromFlexpaToEntityObservationList = (
  flexpaObservationList: any[]
) => {
  const entityObservationList: Observation[] = [];

  for (let i = 0; i < flexpaObservationList.length; i++) {
    const obs = flexpaObservationList[i];
    const entityObservation = fromFlexpaToEntityObservation(obs);
    entityObservationList.push(entityObservation);
  }
  return entityObservationList;
};

export const fromFlexpaToEntityObservation = (params: any) => {
  const observation: Observation = {
    source: constants.CLAIMS,
    fhirReference: params.fhirReference,
    resourceType: constants.OBSERVATION,
  };

  if (params.resource?.effectiveDateTime) {
    observation.effectiveDateTime = params.resource?.effectiveDateTime;
  }
  if (params.resource?.issued) {
    observation.issued = params.resource?.issued;
  }

  if (observation.effectiveDateTime) {
    observation.primaryDate = observation.effectiveDateTime;
  } else {
    observation.primaryDate = new Date(observation.issued);
  }

  if (params.resource?.status) observation.status = params.resource.status;

  const category = params.resource?.category?.[0]?.coding?.[0]?.code;
  if (category) observation.category = category;

  const code = params.resource?.code?.coding?.[0]?.code;
  if (code) observation.code = code;

  const codeDisplay = params.resource?.code?.coding?.[0]?.display;
  if (codeDisplay) observation.codeDisplay = codeDisplay;

  return observation;
};
