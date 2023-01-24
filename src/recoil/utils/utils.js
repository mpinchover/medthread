import { atom } from "recoil";

export const isLoadingState = atom({
  key: "isLoadingState",
  default: false,
});

export const isLoadingClaimsDataState = atom({
  key: "isLoadingClaimsDataState",
  default: false,
});

const idleState = {
  // isAddingMedication: false,
  // isAddingImmunization: false,
  // isAddingCondition: false,
  // isAddingProcedure: false,
  isAddingNote: false,
  isSendingRecords: false,
  isSendRecordsModalOpen: false,
  isRequestingEMR: false,
};
export const modalState = atom({
  key: "modalState",
  default: idleState,
});

// export const getData = atom({
//   key: "getDataasdfadsf",
//   state: false,
// });
