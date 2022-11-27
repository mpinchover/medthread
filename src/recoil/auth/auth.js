import { atom } from "recoil";

const getDefaultValue = () => {
  const authUser = JSON.parse(localStorage.getItem("med_thread_auth_user"));
  if (!authUser) return null;
  return authUser;
};
export const authorizedProfileState = atom({
  key: "authProfile", // unique ID (with respect to other atoms/selectors)
  default: getDefaultValue(),
});
