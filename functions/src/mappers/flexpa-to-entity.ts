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

export const fromFlexpaToEntityMedications = (
  flexpaMedications: any,
  insuranceProviderUid: string
): Medication[] => {
  if (!flexpaMedications.entry) {
    return [];
  }

  const entityMedications: any[] = [];
  for (let i = 0; i < flexpaMedications.entry.length; i++) {
    const entityMedication = fromFlexpaToEntityMedication(
      flexpaMedications.entry[i],
      insuranceProviderUid
    );
    entityMedications.push(entityMedication);
  }

  return entityMedications;
};

export const fromFlexpaToEntityMedication = (
  flexpaMedication: any,
  insuranceProviderUid: string
) => {
  let display =
    flexpaMedication?.resource?.medicationCodeableConcept?.coding[0]?.display;
  let flexpaResourceId = flexpaMedication?.resource?.id;
  let authoredOn = flexpaMedication?.resource?.authoredOn;

  if (!display) display = UNKNOWN;
  if (!authoredOn) authoredOn = UNKNOWN;
  if (!flexpaResourceId) flexpaResourceId = UNKNOWN;
  if (!insuranceProviderUid) insuranceProviderUid = UNKNOWN;

  const med: Medication = {
    medicationName: display,
    dateStarted: authoredOn,
    flexpaResourceId,
    source: CLAIMS,
    insuranceProviderUid,
  };
  return med;
};

//medication requests
export const fromFlexpaToEntityMedicationRequestList = (
  flexpaMedicationRequestList: any[],
  insuranceProviderUid: string
): MedicationRequest[] => {
  const entityMedicationRequestList: MedicationRequest[] = [];

  for (let i = 0; i < flexpaMedicationRequestList.length; i++) {
    const flexpaMedReq = flexpaMedicationRequestList[i];
    const entityMedReq = fromFlexpaToEntityMedicationRequest(
      flexpaMedReq,
      insuranceProviderUid
    );
    entityMedicationRequestList.push(entityMedReq);
  }
  return entityMedicationRequestList;
};

export const fromFlexpaToEntityMedicationRequest = (
  params: any,
  insuranceProviderUid: string
): MedicationRequest => {
  const medicationRequest: MedicationRequest = {
    insuranceProviderUid,
  };

  let flexpaResourceId = params.resource?.id;
  if (flexpaResourceId) medicationRequest.flexpaResourceId = flexpaResourceId;

  let status = params.resource?.status;
  if (status) medicationRequest.status = status;

  let intent = params.resource?.intent;
  if (intent) medicationRequest.intent = intent;

  let code = params.resource?.medicationCodeableConcept?.coding?.[0]?.code;
  if (code) medicationRequest.code = code;

  let codeDisplay = params.resource?.medicationCodeableConcept?.coding?.text;
  if (!codeDisplay)
    codeDisplay =
      params.resource?.medicationCodeableConcept?.coding?.[0]?.display;
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
  flexpaAllergyIntoleranceList: any[],
  insuranceProviderUid: string
): AllergyIntolerance[] => {
  const entityAllergyIntoleranceList: AllergyIntolerance[] = [];
  for (let i = 0; i < flexpaAllergyIntoleranceList.length; i++) {
    const entityAllergyIntolerance = fromFlexpaToEntityAllergyIntolerance(
      flexpaAllergyIntoleranceList[i],
      insuranceProviderUid
    );
    entityAllergyIntoleranceList.push(entityAllergyIntolerance);
  }
  return entityAllergyIntoleranceList;
};

export const fromFlexpaToEntityAllergyIntolerance = (
  params: any,
  insuranceProviderUid: string
): AllergyIntolerance => {
  const allergyIntolerance: AllergyIntolerance = {
    insuranceProviderUid,
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
export const fromFlexpaToEntityConditionList = (
  flexpaConditionList: any[],
  insuranceProviderUid: string
) => {
  const entityConditionList: Condition[] = [];

  for (let i = 0; i < flexpaConditionList.length; i++) {
    const fCondition = flexpaConditionList[i];
    const eCondition = fromFlexpaToEntityCondition(
      fCondition,
      insuranceProviderUid
    );
    entityConditionList.push(eCondition);
  }
  return entityConditionList;
};

export const fromFlexpaToEntityCondition = (
  params: any,
  insuranceProviderUid: string
): Condition => {
  const condition: Condition = {
    insuranceProviderUid,
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
export const fromFlexpaToEntityProcedureList = (
  flexpaProcedureList: any[],
  insuranceProviderUid: string
) => {
  const entityProcedureList: Procedure[] = [];

  for (let i = 0; i < flexpaProcedureList.length; i++) {
    const fProcedure = flexpaProcedureList[i];

    const eProcedure = fromFlexpaToEntityProcedure(
      fProcedure,
      insuranceProviderUid
    );
    entityProcedureList.push(eProcedure);
  }
  return entityProcedureList;
};

// TODO – just dont save null values to Firestore
// use fallbacks for resource code
export const fromFlexpaToEntityProcedure = (
  params: any,
  insuranceProviderUid: string
): Procedure => {
  const procedure: Procedure = {
    insuranceProviderUid,
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
  flexpaImmunizationList: any[],
  insuranceProviderUid: string
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
        insuranceProviderUid,
        vCode
      );
      entityImmunizationList.push(eImmunization);
    }
  }

  return entityImmunizationList;
};

export const fromFlexpaToEntityImmunization = (
  params: any,
  insuranceProviderUid: string,
  vCode: any
): Immunization => {
  const immunization: Immunization = {
    insuranceProviderUid,
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
  flexpaMedicationDispenseList: any[],
  insuranceProviderUid: string
): MedicationDispense[] => {
  const entityMedicationDispenseList: MedicationDispense[] = [];

  for (let i = 0; i < flexpaMedicationDispenseList.length; i++) {
    const medDispense = flexpaMedicationDispenseList[i];
    const entityMedDispense = fromFlexpaToEntityMedicationDispense(
      medDispense,
      insuranceProviderUid
    );
    entityMedicationDispenseList.push(entityMedDispense);
  }
  return entityMedicationDispenseList;
};

export const fromFlexpaToEntityMedicationDispense = (
  params: any,
  insuranceProviderUid: string
): MedicationDispense => {
  const medicationDispense: MedicationDispense = {
    insuranceProviderUid,
  };

  let flexpaResourceId = params.resource?.id;
  if (flexpaResourceId) medicationDispense.flexpaResourceId = flexpaResourceId;

  let status = params.resource?.status;
  if (status) medicationDispense.status = status;

  let intent = params.resource?.intent;
  if (intent) medicationDispense.intent = intent;

  let code = params.resource?.medicationCodeableConcept?.coding?.[0].code;
  if (code) medicationDispense.code = code;

  let codeDisplay = params.resource?.medicationCodeableConcept?.text;
  if (!codeDisplay)
    codeDisplay =
      params.resource?.medicationCodeableConcept?.coding?.[0]?.display;
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
