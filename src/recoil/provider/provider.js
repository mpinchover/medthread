import { atom, selector } from "recoil";
import { getPatientsByHealthcareProviderUid } from "../../rpc/get-patients-by-healthcare-provider-uid";

export const isGettingHealthcareProviderPatientsState = atom({
  key: "isGettingHealthcareProviderPatientsState",
  default: false,
});

export const healthcareProviderPatientsState = atom({
  key: "healthcareProviderPatientsState",
  default: [],
});

export const activeCareProviderPatientState = atom({
  key: "activeCareProviderPatientState",
  default: null,
});
// export const previousPatientsSearchTermState = atom({
//   key: "previousPatientsSearchTermState",
//   default: "",
// });

// export const filteredPreviousPatientsState = selector({
//   key: "filteredPreviousPatientsState",
//   //   set: ({ set }, newValue) => {
//   //     set(previousPatientsSearchTermState, newValue);
//   //   },
//   get: ({ get }) => {
//     let previousPatients = get(previousPatientsState);
//     if (!previousPatients) return [];
//     const searchTerm = get(previousPatientsSearchTermState);

//     previousPatients = previousPatients.filter((x) =>
//       x.account.nameValue.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     return previousPatients;
//   },
// });

export const getPatientsByHealthcareProviderUidCallback =
  ({ set, snapshot }) =>
  async (auth) => {
    try {
      set(isGettingHealthcareProviderPatientsState, true);
      const idToken = await auth.currentUser.getIdToken(
        /* forceRefresh */ true
      );

      let providerPatients = await getPatientsByHealthcareProviderUid(idToken);
      if (!providerPatients) providerPatients = [];
      set(healthcareProviderPatientsState, providerPatients);
    } catch (e) {
      console.log(e);
    } finally {
      set(isGettingHealthcareProviderPatientsState, false);
    }
  };
