import { atom } from "recoil";

export const authorizedProfileState = atom({
  key: "authProfile", // unique ID (with respect to other atoms/selectors)
  default: null, // default value (aka initial value)
});
