import { atom, selector } from "recoil";

const getDefaultValue = () => {
  const authUser = JSON.parse(localStorage.getItem("med_thread_auth_user"));
  return authUser;
};

export const authorizedProfileState = atom({
  key: "authorizedProfileState",
  default: getDefaultValue(),
});
// // might need to use an atom for this too
// export const authorizedProfileState = selector({
//   key: "authorizedProfileState",
//   get: ({ get }) => {
//     const authCacheState = getDefaultValue();
//     if (!authCacheState?.hydratedUserProfile) {
//       localStorage.clear();
//       return null;
//     }
//     return authCacheState;
//   },
// });
