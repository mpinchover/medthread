import { atom } from "recoil";

const procedures = [
  {
    id: 200,
    provider: "DR. SUSAN HOLLAR, AU.D.",
    header: "BIOPSY OF NERVE",
    procedure: "BIOPSY OF NERVE",
    date: "Monday, Jan 4th, 2020.",
  },
  {
    id: 201,
    provider: "MARK KEOHANE, M.D.",
    header: "EXTERNAL RADIATION DOSIMETRY",
    procedure: "EXTERNAL RADIATION DOSIMETRY",
    date: "Monday, Jan 4th, 2020.",
  },
];

export const patientProcedures = atom({
  key: "patientProcedures", // unique ID (with respect to other atoms/selectors)
  default: procedures, // default value (aka initial value)
});
