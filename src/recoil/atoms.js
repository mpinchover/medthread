import { atom, selector, useRecoilState, useRecoilValue } from "recoil";

export const patientMedications = atom({
  key: "patientMedications", // unique ID (with respect to other atoms/selectors)
  default: ["medications"], // default value (aka initial value)
});
