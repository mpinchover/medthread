import { useState, useContext } from "react";
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
      <div className="  w-72 text-center py-2 mb-2  text-gray-600 ">
        Forgot password
      </div>
      <div className="  w-72 border-b border-blue-400 mb-4"></div>
      <form onSubmit={sendResetPasswordEmail}>
        <div className="">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border focus:outline-none px-2 py-2 w-72 mb-4"
            placeholder="Email"
          />
        </div>
        <div></div>
        <div className="mb-4">
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-72 text-sm text-center border rounded-sm px-3 py-3 bg-blue-400 text-white hover:opacity-50"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};
export default ForgotPasswordPage;
