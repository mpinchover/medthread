DROP DATABASE IF EXISTS medthread_dev;
CREATE DATABASE medthread_dev;
USE medthread_dev;

CREATE TABLE authorizedCareProviderLink (
    careProviderUuid VARCHAR(36),
    patientUuid VARCHAR(36),
    uuid VARCHAR(36) NOT NULL UNIQUE PRIMARY KEY
);

CREATE TABLE profiles (
    uuid VARCHAR(36) NOT NULL UNIQUE PRIMARY KEY,
    authUid VARCHAR(36) NOT NULL UNIQUE,
    userUuid VARCHAR(36),
    userRole VARCHAR(36),
    nameValue TEXT
);

CREATE TABLE insuranceProviders (
    uuid VARCHAR(36) NOT NULL UNIQUE PRIMARY KEY,
    userUuid VARCHAR(36) NOT NULL,
    accessToken TEXT,
    providerName TEXT,
    capabilities TEXT
);

CREATE TABLE claimsMedicationRequest (
    uuid VARCHAR(36) NOT NULL UNIQUE PRIMARY KEY,
    authoredOn DATETIME,
    code TEXT,
    codeDisplay TEXT,
    source VARCHAR(36),
    medStatus VARCHAR(36),
    intent VARCHAR(36),
    requesterIdentifier VARCHAR(36),
    requester TEXT,
    dosageInstructionText TEXT,
    dosageInstructionRoute TEXT,
    doseAndRateQuantityValue INT,
    doseAndRateQuantityUnit VARCHAR(36),
    fhirReference TEXT,
    insuranceProviderUuid VARCHAR(36),
    userUuid VARCHAR(36),
    resourceType TINYTEXT,
    createdAt DATETIME,
    updatedAt DATETIME,
    deletedAt DATETIME
);

CREATE TABLE claimsMedicationDispense (
    uuid VARCHAR(36) NOT NULL UNIQUE PRIMARY KEY,
    fhirReference TEXT,
    insuranceProviderUuid VARCHAR(36),
    medStatus VARCHAR(36),
    codeDisplay TEXT,
    code TEXT,
    dispenseType TEXT,
    quantityValue INT,
    quantityUnit VARCHAR(36),
    daysSupply INT,
    whenHandedOver DATETIME,
    intent VARCHAR(36),
    source VARCHAR(36),
    userUuid VARCHAR(36),
    resourceType TINYTEXT,
    createdAt DATETIME,
    updatedAt DATETIME,
    deletedAt DATETIME
);

CREATE TABLE claimsImmunization (
    uuid VARCHAR(36) NOT NULL UNIQUE PRIMARY KEY, 
    fhirReference TEXT,
    insuranceProviderUuid VARCHAR(36),
    source VARCHAR(36),
    immunizationStatus TEXT,
    code TEXT,
    codeDisplay TEXT,
    occurenceDateTime DATETIME,
    userUuid VARCHAR(36),
    resourceType VARCHAR(36)
);

CREATE TABLE claimsAllergyTolerance (
    uuid VARCHAR(36) NOT NULL UNIQUE PRIMARY KEY, 
    fhirReference TEXT,
    insuranceProviderUuid VARCHAR(36),
    source VARCHAR(36),
    clinicalStatus TEXT,
    verificationStatus TEXT,
    code TEXT,
    codeDisplay TEXT,
    onsetDateTime DATETIME,
    recordedDate DATETIME,
    recorder TEXT,
    asserter TEXT,
    reactionManifestation TEXT,
    recorderIdentifier VARCHAR(36),
    asserterIdentifier VARCHAR(36),
    userUuid VARCHAR(36),
    resourceType VARCHAR(36)
);

CREATE TABLE claimsCondition (
    uuid VARCHAR(36) NOT NULL UNIQUE PRIMARY KEY,
    fhirReference TEXT,
    insuranceProviderUuid VARCHAR(36),
    source VARCHAR(36),
    clinicalStatus TEXT,
    verificationStatus TEXT,
    category TEXT,
    code TEXT,
    codeDisplay TEXT,
    userUuid VARCHAR(36),
    resourceType VARCHAR(36)
);

CREATE TABLE claimsProcedure (
    uuid VARCHAR(36) NOT NULL UNIQUE PRIMARY KEY,
    fhirReference TEXT,
    insuranceProviderUuid VARCHAR(36),
    source VARCHAR(36),
    procedureStatus VARCHAR(36),
    code TEXT,
    codeDisplay TEXT,
    performedDateTime DATETIME,
    recorder TEXT,
    recorderIdentifier VARCHAR(36),
    performer TEXT,
    performerIdentifier VARCHAR(36),
    userUuid VARCHAR(36),
    resourceType VARCHAR(36)
);

CREATE TABLE claimsEncounter (
    uuid VARCHAR(36) NOT NULL UNIQUE PRIMARY KEY,
    fhirReference TEXT,
    insuranceProviderUuid VARCHAR(36),
    source VARCHAR(36),
    userUuid VARCHAR(36),
    encounterStatus VARCHAR(36),
    startTime DATETIME,
    endTime DATETIME,
    code TEXT,
    resourceType VARCHAR(36)
);

-- CREATE TABLE claims_care_team_participant (
--     uuid VARCHAR(36) NOT NULL UNIQUE,
--     careTeamUuid VARCHAR(36) NOT NULL,
--     roleCode VARCHAR(36),
--     roleCodeDisplay TEXT,
--     memberCode VARCHAR(36),
--     memberCodeDisplay TEXT
-- );

CREATE TABLE claimsCareTeam (
    uuid VARCHAR(36) NOT NULL UNIQUE PRIMARY KEY,
    fhirReference TEXT,
    insuranceProviderUuid VARCHAR(36),
    source VARCHAR(36),
    userUuid VARCHAR(36),
    careTeamStatus VARCHAR(36),
    resourceType VARCHAR(36),
    participants TEXT
);


CREATE TABLE claimsObesrvation (
    uuid VARCHAR(36) NOT NULL UNIQUE PRIMARY KEY,
    fhirReference TEXT,
    observationStatus TEXT,
    observationSource TEXT, 
    category TEXT,
    code TEXT,
    codeDisplay TEXT,
    effectiveDateTime DATETIME,
    issued DATETIME,
    userUuid VARCHAR(36),
    insuranceProviderUuid VARCHAR(36),
    resourceType VARCHAR(36)
);

CREATE TABLE claimsExplanationOfBenefit (
    uuid VARCHAR(36) NOT NULL UNIQUE PRIMARY KEY,
    userUuid VARCHAR(36) NOT NULL,
    source VARCHAR(36),
    jsonResponse TEXT,
    fhirReference TEXT,
    eobStatus TEXT,
    types TEXT, -- just stringify
    eobUse TEXT,
    patientReference VARCHAR(36),
    insurer TEXT,
    prescription TEXT, -- just stringify
    facilityDisplay TEXT,
    outcome TEXT,
    eobItems TEXT, -- just stringify
    billablePeriodStart DATETIME,
    billablePeriodEnd DATETIME,
    claimCreated DATETIME,
    eobDiagnosis TEXT, -- just stringify
    eobProvider TEXT,
    eobProcedure TEXT, -- justify stringify
    resourceType VARCHAR(36)
);