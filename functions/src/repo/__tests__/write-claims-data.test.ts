import { expect } from "chai";
import {
  getClaimsAllergyIntoleranceByFilter,
  getClaimsMedicationRequestByFilter,
} from "../../controllers/insurance";

import {
  AllergyIntolerance,
  ClaimsData,
  PatientRecordsQueryFilter,
} from "../../types/types";
import {
  batchWriteAllergyIntolerances,
  batchWriteClaimsData,
  batchWriteMedicationRequest,
  getClaimsAllergyIntoleranceByUserUuid,
  getClaimsCareTeamByUserUuid,
  getClaimsConditionByUserUuid,
  getClaimsEncounterByUserUuid,
  getClaimsImmunizationByUserUuid,
  getClaimsMedicationDispenseByUserUuid,
  getClaimsMedicationRequestByUserUuid,
  getClaimsObservationByUserUuid,
  getClaimsProcedureByUserUuid,
  getExplanationOfBenefitByUserUuid,
} from "../insurance";

import {
  getAllergyIntolerances,
  getCareTeam,
  getConditions,
  getEncounters,
  getExplanationOfBenefit,
  getImmunizations,
  getMedicationDispenses,
  getMedicationRequests,
  getObservations,
  getProcedures,
} from "./utils";
// import { deriveClaimsMedications } from "../insurance";

export const runWriteClaimsDataTest = () => {
  describe("test write claims test suite", () => {
    before(() => {
      console.log("RUNNING THIS BEFORE THE TEST");
    });

    after(() => {
      console.log("RUNNING THIS AFTER THE TEST");
      // Database.closeConn();
    });

    // the tests container
    // it("checking for test run", () => {
    //   console.log("RUNNING THIS DURING THE TEST");
    //   console.log("ENV IS");
    //   console.log(process.env.DEV_ENV);
    //   expect(true).to.equal(true);
    // });

    it("batch write allergy intolerance", async () => {
      const userUuid = "user-uuid";
      const allergyIntolerances = getAllergyIntolerances(userUuid);

      try {
        await batchWriteAllergyIntolerances(allergyIntolerances);

        const filter: PatientRecordsQueryFilter = {
          userUuid,
        };
        const items = await getClaimsAllergyIntoleranceByUserUuid(filter);
        expect(items.length).to.equal(2);
      } catch (e) {
        console.log(e);
      }
    });

    it("batch write medication requests", async () => {
      const userUuid = "user-uuid";
      const meds = getMedicationRequests(userUuid);

      try {
        await batchWriteMedicationRequest(meds);

        const filter: PatientRecordsQueryFilter = {
          userUuid,
        };
        const items = await getClaimsMedicationRequestByUserUuid(filter);
        expect(items.length).to.equal(2);
      } catch (e) {
        console.log(e);
      }
    });

    it("batch write claims data", async () => {
      try {
        const userUuid = "user-uuid";
        const medicationRequest = getMedicationRequests(userUuid);
        const medicationDispense = getMedicationDispenses(userUuid);
        const condition = getConditions(userUuid);
        const encounter = getEncounters(userUuid);
        const immunization = getImmunizations(userUuid);
        const procedure = getProcedures(userUuid);
        const careTeam = getCareTeam(userUuid);
        const allergyIntolerance = getAllergyIntolerances(userUuid);
        const observation = getObservations(userUuid);
        const explanationOfBenefit = getExplanationOfBenefit(userUuid);

        const claimsData: ClaimsData = {
          medicationRequest,
          medicationDispense,
          encounter,
          condition,
          immunization,
          procedure,
          careTeam,
          allergyIntolerance,
          observation,
          explanationOfBenefit,
        };
        await batchWriteClaimsData(claimsData);

        const filter: PatientRecordsQueryFilter = {
          userUuid,
        };

        const medicationRequestRes = await getClaimsMedicationRequestByUserUuid(
          filter
        );
        const medicationDispenseRes =
          await getClaimsMedicationDispenseByUserUuid(filter);
        const conditionRes = await getClaimsConditionByUserUuid(filter);

        const encounterRes = await getClaimsEncounterByUserUuid(filter);

        const immunizationRes = await getClaimsImmunizationByUserUuid(filter);

        const procedureRes = await getClaimsProcedureByUserUuid(filter);
        const careTeamRes = await getClaimsCareTeamByUserUuid(filter);

        const allergyIntoleranceRes =
          await getClaimsAllergyIntoleranceByUserUuid(filter);

        const observationRes = await getClaimsObservationByUserUuid(filter);
        const eobRes = await getExplanationOfBenefitByUserUuid(filter);

        expect(medicationRequestRes.length).to.equal(2);
        expect(medicationDispenseRes.length).to.equal(2);
        expect(conditionRes.length).to.equal(2);
        expect(encounterRes.length).to.equal(2);
        expect(immunizationRes.length).to.equal(2);
        expect(procedureRes.length).to.equal(2);
        expect(careTeamRes.length).to.equal(2);
        expect(allergyIntoleranceRes.length).to.equal(2);
        expect(observationRes.length).to.equal(2);
        expect(eobRes.length).to.equal(2);
      } catch (e) {
        console.log(e);
      }
    });
  });
};

// describe("derived medications test suite", () => {

//   });

//   it("derived medications, request and dispense missing for each med", () => {

//     const derivedMedications = deriveClaimsMedications(medRequest, medDispense);
//     expect(derivedMedications.length).to.equal(2);

//     let derivedMed = derivedMedications[0];
//     expect(derivedMed.code === "021" || derivedMed.code === "029").to.be.true;
//     if (derivedMed.code === "021") {
//       expect(derivedMed.lastRequestedOn).to.equal("2023-02-05");
//       expect(derivedMed.firstRequestedOn).to.equal("2019-03-22");
//       expect(derivedMed.codeDisplay).to.equal("TYLENOL");
//       expect(!!derivedMed.firstFillOn).to.be.false;
//     } else {
//       expect(derivedMedications[0].firstFillOn).to.equal("2015-10-09");
//       expect(derivedMedications[0].lastFillOn).to.equal("2025-09-01");
//       expect(!!derivedMed.lastRequestedOn).to.be.false;
//       expect(!!derivedMed.firstRequestedOn).to.be.false;
//       expect(derivedMed.codeDisplay).to.equal("ADVIL");
//     }
//   });
// });
