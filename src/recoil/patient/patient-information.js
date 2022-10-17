import { atom } from "recoil";

const patientInfo = {
  name: "Wellington O'Conner",
  phone: "4032613602",
  email: "woconner@gmail.com",
  streetAddress: "747 Murphy Summit",
  city: "Lake Gabriel",
  district: "Buckinghamshire",
  state: "MO",
  postal: "05855",
  country: "US",
  id: "patient_information",
};

export const patientInformation = atom({
  key: "patientInformation", // unique ID (with respect to other atoms/selectors)
  default: patientInfo, // default value (aka initial value)
});
