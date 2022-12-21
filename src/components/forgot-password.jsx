import { useState, useContext } from "react";
import { TextInput } from "./common";
import { FirebaseContext } from "../firebase/firebase-context";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const { sendResetPasswordEmail } = useContext(FirebaseContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    sendResetPasswordEmail(email);
  };
  return (
    <div className="flex flex-col  flex-1 items-center justify-center ">
      <div className="  w-96 text-2xl text-center text-black ">
        Forgot password
      </div>
      <div className="  w-96   border-b border-black my-6"></div>
      <form
        onSubmit={sendResetPasswordEmail}
        className="flex flex-col space-y-6"
      >
        <TextInput
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          label="Email"
          placeholder="Enter email..."
        />
        <div className="">
          <button
            onClick={handleSubmit}
            className="p-3 px-8 font-bold border rounded-lg bg-black text-white"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};
export default ForgotPasswordPage;
