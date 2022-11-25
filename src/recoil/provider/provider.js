import { atom, selector } from "recoil";
import { getPreviousPatients } from "../../rpc/get-previous-pateints";

export const isGettingPreviousPatientsState = atom({
  key: "isGettingPreviousPatientsState",
  default: false,
});

export const previousPatientsState = atom({
  key: "previousPatientsState",
  default: [],
});

export const previousPatientsSearchTermState = atom({
  key: "previousPatientsSearchTermState",
  default: "",
});

export const filteredPreviousPatientsState = selector({
  key: "filteredPreviousPatientsState",
  //   set: ({ set }, newValue) => {
  //     set(previousPatientsSearchTermState, newValue);
  //   },
  get: ({ get }) => {
    let previousPatients = get(previousPatientsState);
    if (!previousPatients) return [];
    const searchTerm = get(previousPatientsSearchTermState);

    previousPatients = previousPatients.filter((x) =>
      x.account.displayName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return previousPatients;
  },
});

export const getPreviousPatientsCallback =
  ({ set, snapshot }) =>
  async () => {
    try {
      set(isGettingPreviousPatientsState, true);
      let previousPatients = await getPreviousPatients();
      if (!previousPatients) previousPatients = [];
      set(previousPatientsState, previousPatients);
    } catch (e) {
      console.log(e);
    } finally {
      set(isGettingPreviousPatientsState, false);
    }
  };
