import { InvalidArgumentError } from "../errors/errors";

export const validateCreatePatient = (params) => {
  if (!params?.emailValue) throw new Error("Email is required");
  if (!params?.passwordValue) throw new Error("Password is required");
  if (params?.passwordValue !== params?.confirmPasswordValue)
    throw new Error("Passwords do not match");
  if (!params?.nameValue) throw new Error("Name is required");
};

export const validateSaveMedication = (params) => {
  if (!params.dateStarted)
    throw new InvalidArgumentError("Date started required");

  if (!params.medicationName)
    throw new InvalidArgumentError("Medication name required");
};

export const validateSendMedications = () => {};

export const validateUpdatePassword = () => {};

export const validateUpdateEmail = () => {};

export const validateAddInsuranceProvider = () => {};
