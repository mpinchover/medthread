import { atom, selector } from "recoil";
import { getClaimsDataByUserUid } from "../../rpc/get-claims-by-user-uid";
export const recordsSearchQueryState = atom({
  key: "recordsSearchQueryState",
  default: "",
});

export const isLoadingClaimsDataState = atom({
  key: "isLoadingClaimsDataState",
  state: false,
});

export const claimsAllergyIntolerancesState = atom({
  key: "claimsAllergyIntolerancesState",
  default: [],
});

export const filteredClaimsAllergyIntolerancesState = selector({
  key: "filteredClaimsAllergyIntolerancesState",
  get: ({ get }) => {
    const allergyIntolerances = get(claimsAllergyIntolerancesState);
    const searchTerm = get(recordsSearchQueryState);

    return allergyIntolerances.filter((x) =>
      x.codeDisplay.toLowerCase().includes(searchTerm.toLowerCase())
    );
  },
});

const mockConditions = [
  {
    status: "completed",
    code: "1234",
    clinicalStatus: "active",
    verificationStatus: "confirmed",
    codeDisplay: "ELEC SALIVARY REFLEX STIMULATOR",
  },
  {
    status: "completed",
    code: "1334",
    clinicalStatus: "active",
    verificationStatus: "confirmed",
    codeDisplay: "Hypercholesterolemia",
  },
];

export const claimsConditionsState = atom({
  key: "claimsConditionsState",
  default: [],
});

export const filteredClaimsConditionsState = selector({
  key: "filteredClaimsConditionsState",
  get: ({ get }) => {
    const conditions = get(claimsConditionsState);
    const searchTerm = get(recordsSearchQueryState);

    return conditions.filter((x) =>
      x.codeDisplay.toLowerCase().includes(searchTerm.toLowerCase())
    );
  },
});

const mockProcedures = [
  {
    code: "1",
    status: "unknown",
    codeDisplay: "BIOPSY OF NERVE",
    performedDateTime: "2020-12-30",
    recorder: "DR. SUSAN HOLLAR, AU.D",
    performer: "ROBERT SUTHERLAND, MD",
  },
  {
    code: "2",
    status: "unknown",
    codeDisplay: "EXTERNAL RADIATION DOSIMETRY",
    performedDateTime: "2022-12-30",
    recorder: "DR. SUSAN HOLLAR, AU.D",
    performer: "ROBERT SUTHERLAND, MD",
  },
];
export const claimsProceduresState = atom({
  key: "claimsProceduresState",
  default: [],
});

export const filteredClaimsProceduresState = selector({
  key: "filteredClaimsProceduresState",
  get: ({ get }) => {
    const procedures = get(claimsProceduresState);
    const searchTerm = get(recordsSearchQueryState);

    return procedures.filter((x) =>
      x.codeDisplay.toLowerCase().includes(searchTerm.toLowerCase())
    );
  },
});

const mockImmunizations = [
  {
    status: "completed",
    codeDisplay: "Haemophilus influenzae type b vaccine (Hib)",
    occurenceDateTime: "2021-06-08",
  },
  {
    status: "completed",
    codeDisplay: "Hepatitis A and hepatitis B vaccine (HepA HepB)",
    occurenceDateTime: "2022-09-08",
  },
];
export const claimsImmunizationsState = atom({
  key: "claimsImmunizationsState",
  default: [],
});

export const filteredClaimsImmunizationsState = selector({
  key: "filteredClaimsImmunizationsState",
  get: ({ get }) => {
    const immunizations = get(claimsImmunizationsState);
    const searchTerm = get(recordsSearchQueryState);

    return immunizations.filter((x) =>
      x.codeDisplay.toLowerCase().includes(searchTerm.toLowerCase())
    );
  },
});

export const claimsDerivedMedicationsState = atom({
  key: "claimsDerivedMedicationsState",
  default: [],
});

export const filteredClaimsDerivedMedicationsState = selector({
  key: "filteredClaimsDerivedMedicationsState",
  get: ({ get }) => {
    const meds = get(claimsDerivedMedicationsState);
    const searchTerm = get(recordsSearchQueryState);

    return meds.filter((x) =>
      x.codeDisplay.toLowerCase().includes(searchTerm.toLowerCase())
    );
  },
});

export const claimsMedicationRequestState = atom({
  key: "claimsMedicationRequestState",
  default: [],
});

export const claimsMedicationDispenseState = atom({
  key: "claimsMedicationDispenseState",
  default: [],
});

export const recordsActiveCategoryState = atom({
  key: "recordsActiveCategoryState",
  default: "MEDICATIONS",
});

const combinedRequestAndDispense = (request, dispense) => {
  for (let i = 0; i < request.length; i++) {
    request[i].date = request[i].authoredOn;
    request[i].type = "REQUEST";
    if (
      request[i].doseAndRateQuantityUnit &&
      request[i].doseAndRateQuantityValue
    ) {
      request[i].dose =
        request[i].doseAndRateQuantityUnit +
        " " +
        request[i].doseAndRateQuantityValue;
    }
  }

  for (let i = 0; i < dispense.length; i++) {
    dispense[i].date = dispense[i].whenHandedOver;
    dispense[i].type = "DISPENSE";
  }

  const combinedRequestAndDispense = [...request, ...dispense].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return combinedRequestAndDispense;
};

export const getClaimsDataByUserUidCallback =
  ({ set, snapshot }) =>
  async () => {
    try {
      set(isLoadingClaimsDataState, true);

      const claimsData = await getClaimsDataByUserUid();

      if (claimsData.allergyIntolerance) {
        set(claimsAllergyIntolerancesState, claimsData.allergyIntolerance);
      }
      if (claimsData.medicationDispense) {
        set(claimsMedicationDispenseState, claimsData.medicationDispense);
      }
      if (claimsData.medicationRequest) {
        set(claimsMedicationRequestState, claimsData.medicationRequest);
      }

      if (claimsData.derivedClaimsMedications) {
        for (let i = 0; i < claimsData.derivedClaimsMedications.length; i++) {
          const derivedMeds = claimsData.derivedClaimsMedications[i];
          derivedMeds.requestAndDispense = combinedRequestAndDispense(
            derivedMeds.request,
            derivedMeds.dispense
          );
          claimsData.derivedClaimsMedications[i] = derivedMeds;
        }

        set(claimsDerivedMedicationsState, claimsData.derivedClaimsMedications);
      }
      if (claimsData.procedure) {
        // set(claimsProceduresState, claimsData.procedure);
        set(claimsProceduresState, mockProcedures);
      }
      if (claimsData.immunization) {
        // set(claimsImmunizationsState, claimsData.immunization);
        set(claimsImmunizationsState, mockImmunizations);
      }
      if (claimsData.condition) {
        // set(claimsConditionsState, claimsData.condition);
        set(claimsConditionsState, mockConditions);
      }
    } catch (e) {
    } finally {
      set(isLoadingClaimsDataState, false);
    }
  };

/*
  
export interface ClaimsData {
  medicationRequest: MedicationRequest[];
  medicationDispense: MedicationDispense[];
  derivedClaimsMedications?: DerivedMedication[];
  allergyIntolerance: AllergyIntolerance[];
  procedure: Procedure[];
  immunization: Immunization[];
  condition: Condition[];
}
 */
