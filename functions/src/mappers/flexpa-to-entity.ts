import {
  Medication,
  AllergyIntolerance,
  MedicationRequest,
  MedicationDispense,
  Condition,
  Procedure,
  Immunization,
} from "../types";

const UNKNOWN = "UNKNOWN";
const CLAIMS = "CLAIMS";
const ALLERGY_INTOLERANCE = "ALLERGY_INTOLERANCE";
const MEDICATION_REQUEST = "MEDICATION_REQUEST";

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
    source: CLAIMS,
  };

  let flexpaResourceId = params.resource?.id;
  if (flexpaResourceId) medicationRequest.flexpaResourceId = flexpaResourceId;

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
  if (authoredOn) medicationRequest.authoredOn = authoredOn;

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
    source: CLAIMS,
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
  if (onsetDateTime) allergyIntolerance.onsetDateTime = onsetDateTime;

  let recordedDate = params.resource?.recordedDate;
  if (recordedDate) allergyIntolerance.recordedDate = recordedDate;

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

  let flexpaResourceId = params.resource?.id;
  if (flexpaResourceId) allergyIntolerance.flexpaResourceId = flexpaResourceId;

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

export const fromFlexpaToEntityCondition = (params: any): Condition => {
  const condition: Condition = {
    source: CLAIMS,
  };
  let flexpaResourceId = params.resource?.id;
  if (flexpaResourceId) condition.flexpaResourceId = flexpaResourceId;

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
    source: CLAIMS,
  };

  let flexpaResourceId = params.resource?.id;
  if (flexpaResourceId) procedure.flexpaResourceId = flexpaResourceId;

  let status = params.resource.status;
  if (status) procedure.status = status;

  let code = params.resource?.code?.coding?.[0].code;
  if (code) procedure.code = code;

  let codeDisplay = params.resource?.code?.text;
  if (!codeDisplay) codeDisplay = params.resource?.code?.coding?.[0]?.display;
  if (codeDisplay) procedure.codeDisplay = codeDisplay;

  let performedDateTime = params.resource?.performedDateTime;
  if (performedDateTime) procedure.performedDateTime = performedDateTime;

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
    source: CLAIMS,
  };

  const code = vCode.code;
  if (code) immunization.code = code;

  const codeDisplay = vCode.display;
  if (codeDisplay) immunization.codeDisplay = codeDisplay;

  const status = params.status;
  if (status) immunization.status = status;

  const occurenceDateTime = params.occurenceDateTime;
  if (occurenceDateTime) immunization.occurenceDateTime = occurenceDateTime;

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
    source: CLAIMS,
  };

  let flexpaResourceId = params.resource?.id;
  if (flexpaResourceId) medicationDispense.flexpaResourceId = flexpaResourceId;

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
  if (whenHandedOver) medicationDispense.whenHandedOver = whenHandedOver;

  return medicationDispense;
};

export const fromFlexpaToEntityEncounterList = (
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
