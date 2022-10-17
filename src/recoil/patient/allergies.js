import { atom } from "recoil";

const allergies = [
  {
    id: 300,
    provider: "Dr. Margeret Johnson, MD.",
    reaction: "ITCHING",
    agent: "VASOLINE",
    header: "VASOLINE",
    date: "Monday, October 4th, 2020.",
  },
  {
    id: 301,
    provider: "Dr. Margeret Johnson, MD.",
    reaction: "RASHES",
    agent: "VICODIN",
    header: "VICODIN",
    date: "Monday, Jan 4th, 2020.",
  },
];

export const patientAllergies = atom({
  key: "patientAllergies", // unique ID (with respect to other atoms/selectors)
  default: allergies, // default value (aka initial value)
});
