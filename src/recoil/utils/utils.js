import { atom } from "recoil";

export const isLoadingState = atom({
  key: "isLoadingState",
  default: false,
});

const idleState = {
  // isAddingMedication: false,
  // isAddingImmunization: false,
  // isAddingCondition: false,
  // isAddingProcedure: false,
  isAddingNote: false,
  isSendingRecords: false,
};
export const modalState = atom({
  key: "modalState",
  default: idleState,
});
