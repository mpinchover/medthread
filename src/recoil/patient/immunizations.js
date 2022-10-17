import { atom } from "recoil";

const immunizations = [
  {
    id: 100,
    provider: "Dr. Larry Kentworth, MD.",
    header: "Haemophilus influenzae type b vaccine (Hib)",
    immunization: "Haemophilus influenzae type b vaccine (Hib)",
    date: "Monday, Jan 4th, 2020.",
  },
  {
    id: 101,
    provider: "Dr. Larry Kentworth, MD.",
    header: "Hepatitis A and hepatitis B vaccine (HepA HepB)",
    immunization: "Hepatitis A and hepatitis B vaccine (HepA HepB)",
    date: "Monday, Jan 4th, 2020.",
  },
  {
    id: 102,
    provider: "Dr. Larry Kentworth, MD.",
    header: "COVID vaccine first dose",
    immunization: "COVID vaccine first dose",
    date: "Monday, Jan 4th, 2020.",
  },
  {
    id: 103,
    provider: "Dr. Larry Kentworth, MD.",
    header: "COVID vaccine second dose",
    immunization: "COVID vaccine second dose",
    date: "Monday, Jan 4th, 2020.",
  },
  {
    id: 104,
    provider: "Dr. Larry Kentworth, MD.",
    header: "COVID vaccine booster",
    immunization: "COVID vaccine booster",
    date: "Monday, Jan 4th, 2020.",
  },
  {
    id: 105,
    provider: "Dr. Larry Kentworth, MD.",
    header: "POLIO vaccine",
    immunization: "POLIO vaccine",
    date: "Monday, Jan 4th, 2020.",
  },
];

export const patientImmunizations = atom({
  key: "patientImmunizations", // unique ID (with respect to other atoms/selectors)
  default: immunizations, // default value (aka initial value)
});
