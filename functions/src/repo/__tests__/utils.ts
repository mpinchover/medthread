import {
  AllergyIntolerance,
  CareTeam,
  CareTeamParticipant,
  Condition,
  Encounter,
  ExplanationOfBenefit,
  Immunization,
  MedicationDispense,
  MedicationRequest,
  Observation,
  Procedure,
} from "../../types/types";

export const getAllergyIntolerances = (userUuid: string) => {
  if (!userUuid) {
    userUuid = "user-uuid";
  }
  const allergyIntolerances: AllergyIntolerance[] = [
    {
      uuid: "some-uuid",
      fhirReference: "some-reference",
      insuranceProviderUuid: "insurance-provider-uuid",
      source: "source",
      clinicalStatus: "clinical-status",
      verificationStatus: "verification-status",
      code: "code",
      codeDisplay: "code-display",
      onsetDateTime: new Date("2022-08-01"),
      recordedDate: new Date("2022-03-01"),
      recorder: "some-recorder",
      asserter: "some-asserter",
      reactionManifestation: "some-manifestation",
      recorderIdentifier: "recorder-identifier",
      asserterIdentifier: "asserter-identifier",
      userUuid,
      resourceType: "some-resource",
      primaryDate: new Date("2024-01-02"),
    },
    {
      uuid: "some-uuid-2",
      fhirReference: "some-reference-2",
      insuranceProviderUuid: "insurance-provider-uuid-2",
      source: "source-2",
      clinicalStatus: "clinical-status-2",
      verificationStatus: "verification-status-2",
      code: "code-2",
      codeDisplay: "code-display-2",
      onsetDateTime: new Date("2022-08-03"),
      recordedDate: new Date("2022-03-03"),
      recorder: "some-recorder-2",
      asserter: "some-asserter-2",
      reactionManifestation: "some-manifestation-2",
      recorderIdentifier: "recorder-identifier-2",
      asserterIdentifier: "asserter-identifier-2",
      userUuid,
      resourceType: "some-resource-2",
      primaryDate: new Date("2024-02-02"),
    },
  ];
  return allergyIntolerances;
};

export const getConditions = (userUuid: string) => {
  if (!userUuid) userUuid = "user-uuid";
  const conditions: Condition[] = [
    {
      uuid: "uuid",
      fhirReference: "fhirReference",
      insuranceProviderUuid: "insuranceProviderUuid",
      source: "source",
      clinicalStatus: "clinicalStatus",
      verificationStatus: "verificationStatus",
      category: "category",
      code: "code",
      codeDisplay: "codeDisplay",
      userUuid,
      primaryDate: new Date("2024-02-02"),
      resourceType: "some-resource-2",
    },
    {
      uuid: "uuid-2",
      fhirReference: "fhirReference-2",
      insuranceProviderUuid: "insuranceProviderUuid-2",
      source: "source-2",
      clinicalStatus: "clinicalStatus-2",
      verificationStatus: "verificationStatus-2",
      category: "category-2",
      code: "code-2",
      codeDisplay: "codeDisplay-2",
      userUuid,
      primaryDate: new Date("2024-02-04"),
      resourceType: "some-resource-3",
    },
  ];

  return conditions;
};

export const getImmunizations = (userUuid: string) => {
  if (!userUuid) userUuid = "user-uuid";
  const items: Immunization[] = [
    {
      uuid: "uuid",
      fhirReference: "fhirReference",
      insuranceProviderUuid: "insuranceProviderUuid",
      source: "source",
      status: "clinicalStatus",

      code: "code",
      codeDisplay: "codeDisplay",
      userUuid,
      primaryDate: new Date("2024-02-02"),
      occurenceDateTime: new Date("2024-02-02"),
      resourceType: "some-resource-2",
    },
    {
      uuid: "uuid-2",
      fhirReference: "fhirReference-2",
      insuranceProviderUuid: "insuranceProviderUuid-2",
      source: "source-2",
      status: "clinicalStatus-2",

      code: "code-2",
      codeDisplay: "codeDisplay",
      userUuid,
      primaryDate: new Date("2024-02-02"),
      occurenceDateTime: new Date("2024-02-02"),
      resourceType: "some-resource-2",
    },
  ];

  return items;
};

export const getProcedures = (userUuid: string) => {
  if (!userUuid) userUuid = "string";

  const items: Procedure[] = [
    {
      uuid: "uuid",
      fhirReference: "fhirReference",
      insuranceProviderUuid: "insuranceProviderUuid",
      source: "source",
      status: "clinicalStatus",
      code: "code",
      codeDisplay: "codeDisplay",
      userUuid: userUuid,
      primaryDate: new Date("2024-02-02"),
      performedDateTime: new Date("2024-02-02"),
      performer: "performer",
      performerIdentifier: "identifier",
      recorder: "performer",
      recorderIdentifier: "identifier",
      resourceType: "some-resource-2",
    },
    {
      uuid: "uuid-2",
      fhirReference: "fhirReference-2",
      insuranceProviderUuid: "insuranceProviderUuid",
      source: "source",
      status: "clinicalStatus",
      code: "code",
      codeDisplay: "codeDisplay",
      userUuid: userUuid,
      primaryDate: new Date("2024-02-02"),
      performedDateTime: new Date("2024-02-02"),
      performer: "performer",
      performerIdentifier: "identifier",
      recorder: "performer",
      recorderIdentifier: "identifier",
      resourceType: "some-resource-2",
    },
  ];

  return items;
};

export const getEncounters = (userUuid: string) => {
  if (!userUuid) userUuid = "user-uuid";
  const items: Encounter[] = [
    {
      uuid: "uuid",
      fhirReference: "fhirReference",
      insuranceProviderUuid: "insuranceProviderUuid",
      source: "source",
      status: "clinicalStatus",
      code: "code",
      userUuid: userUuid,
      primaryDate: new Date("2024-02-02"),
      start: new Date("2024-02-02"),
      end: new Date("2024-02-02"),
      resourceType: "some-resource-2",
    },
    {
      uuid: "uuid-2",
      fhirReference: "fhirReference",
      insuranceProviderUuid: "insuranceProviderUuid",
      source: "source",
      status: "clinicalStatus",
      code: "code",
      userUuid: userUuid,
      primaryDate: new Date("2024-02-02"),
      start: new Date("2024-02-02"),
      end: new Date("2024-02-02"),
      resourceType: "some-resource-2",
    },
  ];

  return items;
};

export const getCareTeam = (userUuid: string) => {
  if (!userUuid) userUuid = "user-uuid";
  const careTeamParticipants: CareTeamParticipant[] = [
    {
      roleCode: "role-code",
      roleCodeDisplay: "roleCodeDisplay",
      memberCode: "memberCode",
      memberCodeDisplay: "memberCodeDisplay",
    },
    {
      roleCode: "role-code-2",
      roleCodeDisplay: "roleCodeDisplay-2",
      memberCode: "memberCode-2",
      memberCodeDisplay: "memberCodeDisplay",
    },
  ];
  const items: CareTeam[] = [
    {
      uuid: "uuid",
      fhirReference: "fhirReference",
      insuranceProviderUuid: "insuranceProviderUuid",
      source: "source",
      status: "clinicalStatus",
      userUuid,
      primaryDate: new Date("2024-02-02"),
      resourceType: "some-resource-2",
      participants: careTeamParticipants,
    },
    {
      uuid: "uuid-2",
      fhirReference: "fhirReference",
      insuranceProviderUuid: "insuranceProviderUuid",
      source: "source",
      status: "clinicalStatus",
      userUuid,
      primaryDate: new Date("2024-02-02"),
      resourceType: "some-resource-2",
      participants: careTeamParticipants,
    },
  ];

  return items;
};

export const getObservations = (userUuid: string) => {
  if (!userUuid) userUuid = "user-uuid";
  const items: Observation[] = [
    {
      uuid: "uuid",
      source: "source",
      category: "category",

      fhirReference: "fhirReference",
      insuranceProviderUuid: "insuranceProviderUuid",
      status: "clinicalStatus",
      code: "code",
      codeDisplay: "code-display",
      userUuid,
      primaryDate: new Date("2024-02-02"),
      effectiveDateTime: new Date("2024-02-02"),
      issued: new Date("2024-02-02"),
      resourceType: "some-resource-2",
    },
    {
      uuid: "uuid-2",
      source: "source",
      category: "category",

      fhirReference: "fhirReference",
      insuranceProviderUuid: "insuranceProviderUuid",
      status: "clinicalStatus",
      code: "code",
      codeDisplay: "code-display",
      userUuid,
      primaryDate: new Date("2024-02-02"),
      effectiveDateTime: new Date("2024-02-02"),
      issued: new Date("2024-02-02"),
      resourceType: "some-resource-2",
    },
  ];

  return items;
};

export const getExplanationOfBenefit = (userUuid: string) => {
  if (!userUuid) userUuid = "user-uuid";
  const eobs: ExplanationOfBenefit[] = [
    {
      uuid: "uuid",
      userUuid,
      source: "source",
      jsonResponse: " some response",
      fhirReference: "fhir-reference",
      status: "status",
      types: ["type-1", "type-2"],
      use: "some-use",
      patientReference: "some-patient-reference",
      insurer: "some-insurer",
      provider: {
        npiCode: "some-code",
        display: "some-display",
      },
      prescription: {
        ndcCode: "ndc-code",
        display: "display",
      },
      facilityDisplay: "facility-display",
      outcome: "outcome",
      items: [
        {
          sequence: 1,
          productOrService: [
            {
              code: "code",
              codeDisplay: "codeDisplay",
              system: "system",
            },
            {
              code: "code",
              codeDisplay: "codeDisplay",
              system: "system",
            },
          ],
        },
        {
          sequence: 2,
          productOrService: [
            {
              code: "code",
              codeDisplay: "codeDisplay",
              system: "system",
            },
            {
              code: "code",
              codeDisplay: "codeDisplay",
              system: "system",
            },
          ],
        },
      ],
      billablePeriodStart: new Date("2022-01-02"),
      billablePeriodEnd: new Date("2022-01-03"),
      created: new Date("2022-01-05"),
      diagnosis: [
        {
          sequence: 1,
          codeableConcept: {
            codeSystem: "system",
            code: "code",
            codeType: "code-type",
            display: "display",
          },
        },
        {
          sequence: 2,
          codeableConcept: {
            codeSystem: "system-2",
            code: "code-2",
            codeType: "code-type-2",
            display: "display-2",
          },
        },
      ],
      procedure: [
        {
          sequence: 1,
          date: new Date("2022-01-02"),
          reference: "some-reference",
          display: "display",
          procedure: {
            code: "some-code",
            uuid: "some-uuid",
          },
        },
        {
          sequence: 2,
          date: new Date("2022-03-02"),
          reference: "some-reference",
          display: "display",
          procedure: {
            code: "some-code",
            uuid: "some-uuid",
          },
        },
      ],
      primaryDate: new Date("2022-03-04"),
      resourceType: "resourceType",
    },
    {
      uuid: "uuid-2",
      userUuid,
      source: "source",
      jsonResponse: " some response",
      fhirReference: "fhir-reference",
      status: "status",
      types: ["type-1", "type-2"],
      use: "some-use",
      patientReference: "some-patient-reference",
      insurer: "some-insurer",
      provider: {
        npiCode: "some-code",
        display: "some-display",
      },
      prescription: {
        ndcCode: "ndc-code",
        display: "display",
      },
      facilityDisplay: "facility-display",
      outcome: "outcome",
      items: [
        {
          sequence: 1,
          productOrService: [
            {
              code: "code",
              codeDisplay: "codeDisplay",
              system: "system",
            },
            {
              code: "code",
              codeDisplay: "codeDisplay",
              system: "system",
            },
          ],
        },
        {
          sequence: 2,
          productOrService: [
            {
              code: "code",
              codeDisplay: "codeDisplay",
              system: "system",
            },
            {
              code: "code",
              codeDisplay: "codeDisplay",
              system: "system",
            },
          ],
        },
      ],
      billablePeriodStart: new Date("2022-01-02"),
      billablePeriodEnd: new Date("2022-01-03"),
      created: new Date("2022-01-05"),
      diagnosis: [
        {
          sequence: 1,
          codeableConcept: {
            codeSystem: "system",
            code: "code",
            codeType: "code-type",
            display: "display",
          },
        },
        {
          sequence: 2,
          codeableConcept: {
            codeSystem: "system-2",
            code: "code-2",
            codeType: "code-type-2",
            display: "display-2",
          },
        },
      ],
      procedure: [
        {
          sequence: 1,
          date: new Date("2022-01-02"),
          reference: "some-reference",
          display: "display",
          procedure: {
            code: "some-code",
            uuid: "some-uuid",
          },
        },
        {
          sequence: 2,
          date: new Date("2022-03-02"),
          reference: "some-reference",
          display: "display",
          procedure: {
            code: "some-code",
            uuid: "some-uuid",
          },
        },
      ],
      primaryDate: new Date("2022-03-04"),
      resourceType: "resourceType",
    },
  ];
  return eobs;
};

export const getMedicationRequests = (userUuid: string) => {
  if (!userUuid) userUuid = "user-uuid";
  const meds: MedicationRequest[] = [
    {
      uuid: "uuid",
      authoredOn: new Date("2022-02-03"),
      code: "code",
      codeDisplay: "codeDisplay",
      source: "source",
      status: "status",
      intent: "intent",
      requesterIdentifier: "requesterIdentifier",
      requester: "requester",
      dosageInstructionText: "dosageInstructionText",
      dosageInstructionRoute: "dosageInstructionRoute",
      doseAndRateQuantityValue: 100,
      doseAndRateQuantityUnit: "doseAndRateQuantityUnit",
      fhirReference: "fhirReference",
      insuranceProviderUuid: "insuranceProviderUuid",
      userUuid,
      primaryDate: new Date("2009-01-03"),
      resourceType: "resourceType",
    },
    {
      uuid: "uuid-2",
      authoredOn: new Date("2022-04-03"),
      code: "code",
      codeDisplay: "codeDisplay",
      source: "source",
      status: "status",
      intent: "intent",
      requesterIdentifier: "requesterIdentifier",
      requester: "requester",
      dosageInstructionText: "dosageInstructionText",
      dosageInstructionRoute: "dosageInstructionRoute",
      doseAndRateQuantityValue: 100,
      doseAndRateQuantityUnit: "doseAndRateQuantityUnit",
      fhirReference: "fhirReference",
      insuranceProviderUuid: "insuranceProviderUuid",
      userUuid,
      primaryDate: new Date("2009-01-03"),
      resourceType: "resourceType",
    },
  ];
  return meds;
};

export const getMedicationDispenses = (userUuid: string) => {
  if (!userUuid) userUuid = "user-uuid";
  const items: MedicationDispense[] = [
    {
      uuid: "uuid",
      code: "code",
      codeDisplay: "codeDisplay",
      source: "source",
      status: "status",
      type: "type",
      quantityValue: 100,
      quantityUnit: "quantityUnit",
      daysSupply: 30,
      whenHandedOver: new Date("2022-03-01"),
      intent: "intent",
      userUuid,
      primaryDate: new Date("2022-03-01"),
      resourceType: "resourceType",
      fhirReference: "fhirReference",
      insuranceProviderUuid: "insuranceProviderUuid",
    },
    {
      uuid: "uuid-2",
      code: "code",
      codeDisplay: "codeDisplay",
      source: "source",
      status: "status",
      type: "type",
      quantityValue: 100,
      quantityUnit: "quantityUnit",
      daysSupply: 30,
      whenHandedOver: new Date("2022-03-01"),
      intent: "intent",
      userUuid,
      primaryDate: new Date("2022-03-01"),
      resourceType: "resourceType",
      fhirReference: "fhirReference",
      insuranceProviderUuid: "insuranceProviderUuid",
    },
  ];
  return items;
};
