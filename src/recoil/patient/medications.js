import { atom } from "recoil";

const medications = [
  {
    id: 1,
    provider: "Dr. Larry Kentworth, MD.",

    dose: "1 tablet per 24 hours.",
    header: "CODEINE",
    medication: "CODEINE",
    date: "Monday, Jan 4th, 2020.",
  },
  {
    id: 2,
    provider: "Dr. Margeret Johnson, MD.",

    dose: "2 tablet per 6 hours.",
    header: "OXYCODONE",
    medication: "OXYCODONE",
    date: "Monday, October 4th, 2020.",
  },
  {
    id: 3,
    provider: "Dr. Larry Kentworth, MD.",

    dose: "1 pill every day.",
    header: "METHADONE",
    medication: "METHADONE",
    date: "Monday, Jan 4th, 2020.",
  },
  {
    id: 4,
    provider: "Dr. Margeret Johnson, MD.",

    dose: "2 tablet per 6 hours.",
    header: "VICODIN",
    medication: "VICODIN",
    date: "Monday, October 4th, 2020.",
  },
  {
    id: 5,
    provider: "Dr. Larry Kentworth, MD.",

    dose: "1 tablet per 24 hours.",
    header: "OXYCODONE",
    medication: "OXYCODONE",
    date: "Monday, Jan 4th, 2020.",
  },
  {
    id: 6,
    provider: "Dr. Margeret Johnson, MD.",

    dose: "2 tablet per 6 hours.",
    header: "MORPHINE",
    medication: "MORPHINE",
    date: "Monday, October 4th, 2020.",
  },
  {
    id: 7,
    provider: "Dr. Larry Kentworth, MD.",

    dose: "1 tablet per 24 hours.",
    header: "HYDROCODONE",
    medication: "HYDROCODONE",
    date: "Monday, Jan 4th, 2020.",
  },
  {
    id: 8,
    provider: "Dr. Margeret Johnson, MD.",

    dose: "2 tablet per 6 hours.",
    header: "VICODIN",
    medication: "VICODIN",
    date: "Monday, October 4th, 2020.",
  },
];

export const patientMedications = atom({
  key: "patientMedications", // unique ID (with respect to other atoms/selectors)
  default: medications, // default value (aka initial value)
});
