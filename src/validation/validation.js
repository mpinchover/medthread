import { InvalidArgumentError } from "../errors/errors";

export const validateCreatePatient = ({
  name,
  password,
  confirmPassword,
  email,
}) => {
  if (!email) throw new Error("Email is required");
  if (!password) throw new Error("Password is required");
  if (password !== confirmPassword) throw new Error("Passwords do not match");
  if (!name) throw new Error("Name is required");
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
