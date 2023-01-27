import { atom, selector } from "recoil";
import { getClaimsDataByUserUid } from "../../rpc/get-claims-by-user-uid";
import { getClaimsDataByUserUidForProvider } from "../../rpc/get-claims-data-by-user-uid-for-provider";
import { isLoadingClaimsDataState } from "../utils/utils";
import { activeCareProviderPatientState } from "../provider/provider";
export const recordsSearchQueryState = atom({
  key: "recordsSearchQueryState",
  default: "",
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
  default: "LIST_VIEW",
});

export const getClaimsDataByUserUidCallback =
  ({ set, snapshot }) =>
  async (patientUid) => {
    try {
      set(isLoadingClaimsDataState, true);

      let claimsData;
      if (patientUid) {
        claimsData = await getClaimsDataByUserUidForProvider(patientUid);
      } else {
        claimsData = await getClaimsDataByUserUid();
      }

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
          claimsData.derivedClaimsMedications[i].requestAndDispense =
            claimsData.derivedClaimsMedications[i].derivedHistory;
        }

        set(claimsDerivedMedicationsState, claimsData.derivedClaimsMedications);
      }
      if (claimsData.procedure) {
        // set(claimsProceduresState, claimsData.procedure);
        set(claimsProceduresState, claimsData.procedure);
      }
      if (claimsData.immunization) {
        // set(claimsImmunizationsState, claimsData.immunization);
        set(claimsImmunizationsState, claimsData.immunization);
      }
      if (claimsData.condition) {
        // set(claimsConditionsState, claimsData.condition);
        set(claimsConditionsState, claimsData.condition);
      }
    } catch (e) {
      set(isLoadingClaimsDataState, false);
    } finally {
      set(isLoadingClaimsDataState, false);
    }
  };
