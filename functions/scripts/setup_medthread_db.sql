DROP DATABASE IF EXISTS medthread_dev;
CREATE DATABASE medthread_dev;
USE medthread_dev;

CREATE TABLE authorizedCareProviderLink (
    careProviderUuid VARCHAR(36),
    patientUuid VARCHAR(36),
    uuid VARCHAR(36) NOT NULL UNIQUE
);

CREATE TABLE medicationRequest (
    uuid VARCHAR(36) NOT NULL UNIQUE,
    authoredOn DATETIME,
    code VARCHAR(36),
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
    fhirReference VARCHAR(36),
    insuranceProviderUuid VARCHAR(36),
    userUid VARCHAR(36),
    resourceType TINYTEXT,
    createdAt DATETIME,
    updatedAt DATETIME,
    deletedAt DATETIME
);
