export const validateCreatePatient = ({
  name,
  password,
  confirmPassword,
  email,
}) => {
  console.log(password, confirmPassword);
  if (!email) throw new Error("Email is required");
  if (!password) throw new Error("Password is required");
  if (password !== confirmPassword) throw new Error("Passwords do not match");
  if (!name) throw new Error("Name is required");
};
