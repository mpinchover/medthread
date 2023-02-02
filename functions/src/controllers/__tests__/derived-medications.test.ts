import { expect } from "chai";
import { MedicationRequest, MedicationDispense } from "../../types/types";
import { deriveClaimsMedications } from "../insurance";
describe("test run suite", () => {
  // the tests container
  it("checking for test run", () => {
    expect(true).to.equal(true);
  });
});

describe("derived medications test suite", () => {
  // the tests container
  it("derived medications for both request and dispense for single med", () => {
    const medRequest: MedicationRequest[] = [
      {
        code: "029",
        codeDisplay: "ADVIL",
        authoredOn: "2022-10-09",
      },
      {
        code: "029",
        codeDisplay: "ADVIL",
        authoredOn: "2021-09-01",
      },
      {
        code: "029",
        codeDisplay: "ADVIL",
        authoredOn: "2023-02-05",
      },
      {
        code: "029",
        codeDisplay: "ADVIL",
        authoredOn: "2019-03-22",
      },
    ];
    const medDispense: MedicationDispense[] = [
      {
        code: "029",
        codeDisplay: "ADVIL",
        whenHandedOver: "2015-10-09",
      },
      {
        code: "029",
        codeDisplay: "ADVIL",
        whenHandedOver: "2025-09-01",
      },
      {
        code: "029",
        codeDisplay: "ADVIL",
        whenHandedOver: "2024-02-05",
      },
      {
        code: "029",
        codeDisplay: "ADVIL",
        whenHandedOver: "2016-03-22",
      },
    ];

    const derivedMedications = deriveClaimsMedications(medRequest, medDispense);
    expect(derivedMedications.length).to.equal(1);
    expect(derivedMedications[0].firstFillOn).to.equal("2015-10-09");
    expect(derivedMedications[0].lastFillOn).to.equal("2025-09-01");
    expect(derivedMedications[0].lastRequestedOn).to.equal("2023-02-05");
    expect(derivedMedications[0].firstRequestedOn).to.equal("2019-03-22");
    expect(derivedMedications[0].code).to.equal("029");
    expect(derivedMedications[0].codeDisplay).to.equal("ADVIL");
  });

  it("derived medications for both request and dispense for two meds", () => {
    const medRequest: MedicationRequest[] = [
      {
        code: "029",
        codeDisplay: "ADVIL",
        authoredOn: "2022-10-09",
      },
      {
        code: "029",
        codeDisplay: "ADVIL",
        authoredOn: "2021-09-01",
      },
      {
        code: "029",
        codeDisplay: "ADVIL",
        authoredOn: "2023-02-05",
      },
      {
        code: "029",
        codeDisplay: "ADVIL",
        authoredOn: "2019-03-22",
      },
      {
        code: "021",
        codeDisplay: "TYLENOL",
        authoredOn: "2022-10-09",
      },
      {
        code: "021",
        codeDisplay: "TYLENOL",
        authoredOn: "2021-09-01",
      },
      {
        code: "021",
        codeDisplay: "TYLENOL",
        authoredOn: "2023-02-05",
      },
      {
        code: "021",
        codeDisplay: "TYLENOL",
        authoredOn: "2019-03-22",
      },
    ];
    const medDispense: MedicationDispense[] = [
      {
        code: "029",
        codeDisplay: "ADVIL",
        whenHandedOver: "2015-10-09",
      },
      {
        code: "029",
        codeDisplay: "ADVIL",
        whenHandedOver: "2025-09-01",
      },
      {
        code: "029",
        codeDisplay: "ADVIL",
        whenHandedOver: "2024-02-05",
      },
      {
        code: "029",
        codeDisplay: "ADVIL",
        whenHandedOver: "2016-03-22",
      },
      {
        code: "021",
        codeDisplay: "TYLENOL",
        whenHandedOver: "2015-10-09",
      },
      {
        code: "021",
        codeDisplay: "TYLENOL",
        whenHandedOver: "2025-09-01",
      },
      {
        code: "021",
        codeDisplay: "TYLENOL",
        whenHandedOver: "2024-02-05",
      },
      {
        code: "021",
        codeDisplay: "TYLENOL",
        whenHandedOver: "2016-03-22",
      },
    ];

    const derivedMedications = deriveClaimsMedications(medRequest, medDispense);
    expect(derivedMedications.length).to.equal(2);
    expect(derivedMedications[0].firstFillOn).to.equal("2015-10-09");
    expect(derivedMedications[0].lastFillOn).to.equal("2025-09-01");
    expect(derivedMedications[0].lastRequestedOn).to.equal("2023-02-05");
    expect(derivedMedications[0].firstRequestedOn).to.equal("2019-03-22");
    expect(derivedMedications[0].code).to.equal("029");
    expect(derivedMedications[0].codeDisplay).to.equal("ADVIL");
    expect(derivedMedications[1].firstFillOn).to.equal("2015-10-09");
    expect(derivedMedications[1].lastFillOn).to.equal("2025-09-01");
    expect(derivedMedications[1].lastRequestedOn).to.equal("2023-02-05");
    expect(derivedMedications[1].firstRequestedOn).to.equal("2019-03-22");
    expect(derivedMedications[1].code).to.equal("021");
    expect(derivedMedications[1].codeDisplay).to.equal("TYLENOL");
  });

  it("derived medications, request and dispense missing for each med", () => {
    const medRequest: MedicationRequest[] = [
      {
        code: "021",
        codeDisplay: "TYLENOL",
        authoredOn: "2022-10-09",
      },
      {
        code: "021",
        codeDisplay: "TYLENOL",
        authoredOn: "2021-09-01",
      },
      {
        code: "021",
        codeDisplay: "TYLENOL",
        authoredOn: "2023-02-05",
      },
      {
        code: "021",
        codeDisplay: "TYLENOL",
        authoredOn: "2019-03-22",
      },
    ];
    const medDispense: MedicationDispense[] = [
      {
        code: "029",
        codeDisplay: "ADVIL",
        whenHandedOver: "2015-10-09",
      },
      {
        code: "029",
        codeDisplay: "ADVIL",
        whenHandedOver: "2025-09-01",
      },
      {
        code: "029",
        codeDisplay: "ADVIL",
        whenHandedOver: "2024-02-05",
      },
      {
        code: "029",
        codeDisplay: "ADVIL",
        whenHandedOver: "2016-03-22",
      },
    ];

    const derivedMedications = deriveClaimsMedications(medRequest, medDispense);
    expect(derivedMedications.length).to.equal(2);

    let derivedMed = derivedMedications[0];
    expect(derivedMed.code === "021" || derivedMed.code === "029").to.be.true;
    if (derivedMed.code === "021") {
      expect(derivedMed.lastRequestedOn).to.equal("2023-02-05");
      expect(derivedMed.firstRequestedOn).to.equal("2019-03-22");
      expect(derivedMed.codeDisplay).to.equal("TYLENOL");
      expect(!!derivedMed.firstFillOn).to.be.false;
    } else {
      expect(derivedMedications[0].firstFillOn).to.equal("2015-10-09");
      expect(derivedMedications[0].lastFillOn).to.equal("2025-09-01");
      expect(!!derivedMed.lastRequestedOn).to.be.false;
      expect(!!derivedMed.firstRequestedOn).to.be.false;
      expect(derivedMed.codeDisplay).to.equal("ADVIL");
    }
  });
});
