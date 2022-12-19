import { atom, selector } from "recoil";
import axios from "axios";
import { collection, query, where, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { addMedication } from "../../rpc/add-medication";
import { updateMedication } from "../../rpc/update-medication";
import { getMedicationByUid } from "../../rpc/get-medication-by-uid";
import { getPatientSourcedMedications } from "../../rpc/get-patient-sourced-medications";
import { removeMedication } from "../../rpc/remove-medication";
import { sendMedicationsToProvider } from "../../rpc/send-medications";
import { getMedicationsForProvider } from "../../rpc/get-medications-for-provider";
import { getMedicationsForPatient } from "../../rpc/get-medications-by-patient-uid";
import { removeHealthcareProvider } from "../../rpc/remove-healthcare-provider";
import { activePatientState } from "../provider/provider";
import { saveMedication } from "../../rpc/save-medication";
import { getPatientProfileForProviderByUid } from "../../rpc/get-patient-profile-for-provider-by-uid";
import { getMedicationsByUserUid } from "../../rpc/get-medications-by-user-uid";

export const patientSourcedMedicationListState = atom({
  key: "patientSourcedMedicationListState",
  default: [],
});

export const medicationListState = atom({
  key: "medicationListState",
  default: [],
});

export const medicationBeingUpdatedState = atom({
  key: "medicationBeingUpdatedState",
  default: null,
});

export const medicationBeingUpdatedValuesState = atom({
  key: "medicationBeingUpdatedValuesState",
  default: {
    medicationName: "",
    dose: "",
    prescribedBy: "",
    dateStarted: "",
    status: "",
    medicationType: "",
  },
});

export const loadingGetMedicationState = atom({
  key: "loadingGetMedicationState",
  default: false,
});

export const loadingGetMedicationForUpdateState = atom({
  key: "loadingGetMedicationForUpdateState",
  default: false,
});

export const loadingDerivedMedicationlistState = atom({
  key: "loadingDerivedMedicationlistState",
  default: false,
});

export const isUpdatingMedicationState = atom({
  key: "isUpdatingMedicationState",
  default: false,
});

export const isRemovingMedicationState = atom({
  key: "isRemovingMedicationState",
  default: false,
});

export const isRemovingCareProviderState = atom({
  key: "isRemovingCareProviderState",
  default: false,
});

export const isAddingMedicationState = atom({
  key: "isAddingMedicationState",
  default: false,
});

export const isSendingMedicationsState = atom({
  key: "isSendingMedicationsState",
  default: false,
});

export const medicationSearchTermState = atom({
  key: "medicationSearchTermState",
  default: "",
});

const fakeMeds = [
  {
    medicationName: "Advil",
    dateStarted: "2020-01-02",
    source: "CLAIMS",
  },
  {
    medicationName: "Ibuprofen",
    dateStarted: "2020-02-02",
    source: "PATIENT",
  },
  {
    medicationName: "Advil",
    dateStarted: "2020-01-02",
    source: "CLAIMS",
  },
  {
    medicationName: "Advil",
    dateStarted: "2020-01-02",
    source: "CLAIMS",
  },
  {
    medicationName: "Advil",
    dateStarted: "2020-01-02",
    source: "CLAIMS",
  },
  {
    medicationName: "Ibuprofen",
    dateStarted: "2020-02-02",
    source: "PATIENT",
  },
  {
    medicationName: "Advil",
    dateStarted: "2020-01-02",
    source: "CLAIMS",
  },
  {
    medicationName: "Ibuprofen",
    dateStarted: "2020-02-02",
    source: "PATIENT",
  },
  {
    medicationName: "Advil",
    dateStarted: "2020-01-02",
    source: "CLAIMS",
  },
  {
    medicationName: "Advil",
    dateStarted: "2020-01-02",
    source: "CLAIMS",
  },
  {
    medicationName: "Advil",
    dateStarted: "2020-01-02",
    source: "CLAIMS",
  },
  {
    medicationName: "Ibuprofen",
    dateStarted: "2020-02-02",
    source: "PATIENT",
  },
];
export const derivedMedicationsState = atom({
  key: "derivedMedicationsState",
  default: [],
});

export const filteredDerivedMedicationsState = selector({
  key: "filteredDerivedMedicationsState",
  get: ({ get }) => {
    const searchTerm = get(medicationSearchTermState);
    let medications = get(derivedMedicationsState);

    medications = medications.filter((x) =>
      x.medicationName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return medications;
  },
});

// depreicate this
export const loadMedicationListState = atom({
  key: "loadMedicationListState",
  default: false,
});

export const saveMedicationCallback =
  ({ set, snapshot }) =>
  async (params) => {
    try {
      // use this one
      set(loadingDerivedMedicationlistState, true);

      const currentMedicationlist = snapshot.getLoadable(
        derivedMedicationsState
      ).contents;

      if (!params.source) params.source = "PATIENT";

      const medication = await saveMedication(params);
      const newMedicationList = [...currentMedicationlist, medication].sort(
        (a, b) =>
          new Date(b.dateStarted).valueOf() - new Date(a.dateStarted).valueOf()
      );

      set(derivedMedicationsState, newMedicationList);
    } catch (e) {
      console.log(e);
    } finally {
      set(loadingDerivedMedicationlistState, false);
    }
  };

export const getMedicationsForProviderCallback =
  ({ set, snapshot }) =>
  async (patientUid) => {
    try {
      // use this one
      set(loadingDerivedMedicationlistState, true);

      const medications = await getMedicationsForProvider(patientUid);
      set(derivedMedicationsState, medications);

      const patientProfile = await getPatientProfileForProviderByUid(
        patientUid
      );
      set(activePatientState, patientProfile);
    } catch (e) {
      console.log(e);
    } finally {
      set(loadingDerivedMedicationlistState, false);
    }
  };

export const getMedicationsForPatientCallback =
  ({ set, snapshot }) =>
  async () => {
    try {
      set(loadingDerivedMedicationlistState, true);

      const medications = await getMedicationsForPatient();

      set(derivedMedicationsState, medications);
    } catch (e) {
      console.log(e);
    } finally {
      set(loadingDerivedMedicationlistState, false);
    }
  };

export const sendMedicationsToCareProviderCallback =
  ({ set, snapshot }) =>
  async (healthcareProviderEmail) => {
    try {
      set(isSendingMedicationsState, true);

      await sendMedicationsToProvider(healthcareProviderEmail);

      document.dispatchEvent(new Event("SUCCESS_SEND_MEDICATIONS_EVENT"));
    } catch (e) {
      console.log("FAILED TO SEND MEDS");
      document.dispatchEvent(new Event("FAILED_SEND_MEDICATIONS_EVENT"));
    } finally {
      set(isSendingMedicationsState, false);
    }
  };

export const removeCareProviderEmailCallback =
  ({ set, snapshot }) =>
  async (heathcareProviderUid) => {
    try {
      set(isRemovingCareProviderState, true);

      await removeHealthcareProvider(heathcareProviderUid);

      // document.dispatchEvent(new Event("SUCCESS_SEND_MEDICATIONS_EVENT"));
    } catch (e) {
      // document.dispatchEvent(new Event("FAILED_SEND_MEDICATIONS_EVENT"));
    } finally {
      set(isRemovingCareProviderState, false);
    }
  };

export const addMedicationCallback =
  ({ set, snapshot }) =>
  async (params) => {
    try {
      // add in validation here

      set(isAddingMedicationState, true);
      const med = await addMedication(params);

      document.dispatchEvent(new Event("SUCCESS_ADD_MEDICATION_EVENT"));
    } catch (e) {
      console.log(e);
      document.dispatchEvent(new Event("FAILED_ADD_MEDICATION_EVENT"));
    } finally {
      set(isAddingMedicationState, false);
    }
  };

export const getMedicationForUpdateCallback =
  ({ set, snapshot }) =>
  async (uid) => {
    try {
      set(loadingGetMedicationForUpdateState, true);

      const med = await getMedicationByUid(uid);
      set(medicationBeingUpdatedState, med);
      set(medicationBeingUpdatedValuesState, med);
    } catch (e) {
    } finally {
      set(loadingGetMedicationForUpdateState, false);
    }
  };

export const getMedicationCallback =
  ({ set, snapshot }) =>
  async (uid) => {
    try {
      set(loadingGetMedicationState, true);

      const med = await getMedicationsByUserUid(uid);
      set(medicationBeingUpdatedState, med);
    } catch (e) {
    } finally {
      set(loadingGetMedicationState, false);
    }
  };

export const getMedicationsByUserUidCallback =
  ({ set, snapshot }) =>
  async () => {
    try {
      set(loadingGetMedicationState, true);

      const meds = await getMedicationsByUserUid();

      set(derivedMedicationsState, meds);
    } catch (e) {
    } finally {
      set(loadingGetMedicationState, false);
    }
  };

// have a seperate callback to get all the medications
export const updateMedicationCallback =
  ({ set, snapshot }) =>
  async (params) => {
    try {
      // add in validation here
      // document.dispatchEvent(new Event("PENDING_UPDATE_MEDICATION_EVENT"));
      set(isUpdatingMedicationState, true);

      // need the id here, don't forget
      await updateMedication(params);
      // set(medicationBeingUpdatedState, null);
      document.dispatchEvent(new Event("SUCCESS_UPDATE_MEDICATION_EVENT"));
    } catch (e) {
      console.log(e);
      document.dispatchEvent(new Event("FAILED_UPDATE_MEDICATION_EVENT"));
    } finally {
      set(isUpdatingMedicationState, false);
    }
  };

export const removeMedicationCallback =
  ({ set, snapshot }) =>
  async (uid) => {
    try {
      set(loadingDerivedMedicationlistState, true);

      const currentMedicationlist = snapshot.getLoadable(
        derivedMedicationsState
      ).contents;

      await removeMedication(uid);

      let newMedicationList = currentMedicationlist.filter(
        (x) => x.uid !== uid
      );
      newMedicationList = newMedicationList.sort(
        (a, b) =>
          new Date(b.dateStarted).valueOf() - new Date(a.dateStarted).valueOf()
      );

      set(derivedMedicationsState, newMedicationList);
    } catch (e) {
      console.log(e);
    } finally {
      set(loadingDerivedMedicationlistState, false);
    }
  };

export const getDerivedMedicationListCallback =
  ({ set, snapshot }) =>
  async (patientUid) => {
    try {
      set(loadingDerivedMedicationlistState, true);

      // get patient sourced medications
      const patientSourcedMeds = await getPatientSourcedMedications(patientUid);
      set(patientSourcedMedicationListState, patientSourcedMeds);

      // get insurance sourced medications
    } catch (e) {
      console.log(e);
    } finally {
      set(loadingDerivedMedicationlistState, false);
    }
  };

export const medicationsCallback =
  ({ set, snapshot }) =>
  async (get) => {
    set(loadMedicationListState, true);
    try {
      const authUser = JSON.parse(localStorage.getItem("med_thread_auth_user"));
      const { idToken } = authUser;

      const res = await axios({
        method: "get",
        url: "http://127.0.0.1:5001/healthcare-f57e8/us-central1/app/get-medications-by-uid",

        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      set(medicationListState, fakeMeds);
    } catch (e) {
      console.log(e);
    } finally {
      set(loadMedicationListState, false);
    }
  };
