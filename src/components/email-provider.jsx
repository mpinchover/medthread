import React, { useState } from "react";
import { withPrivateRoute } from "./hocs";
const EmailProvider = () => {
  const [messageSent, setMessageSet] = useState(false);

  if (messageSent) {
    return (
      <div className="px-5 py-4 text-lg">
        <div>Your message to Dr. Larry Mendoza, MD. was sent!</div>
      </div>
    );
  }
  return (
    <div className="px-5 py-4 text-lg">
      <div className="flex flex-row mb-1">
        <div className="w-20 ">To</div>
        <input
          className=" bg-transparent "
          disabled
          placeholder="Dr. Larry Mendoza, MD."
        />
      </div>
      <div className="flex flex-row mb-1">
        <div className="w-20  ">From</div>
        <input
          className="bg-transparent"
          disabled
          placeholder="Dr. Carl Waylan, MD."
        />
      </div>
      <div className="flex flex-row mb-10">
        <div className="w-20">Subject</div>
        <input
          className="bg-transparent"
          disabled
          placeholder="Wellington O'Conner."
        />
      </div>
      <div className="border mb-3">
        <textarea
          rows={10}
          className="rounded-sm w-full focus:outline-none py-2 px-2 resize-none"
          placeholder="Type message here..."
        />
      </div>
      <button
        onClick={() => setMessageSet(true)}
        className="border px-5 py-2 hover:opacity-50 bg-blue-400 text-white"
      >
        Submit
      </button>
    </div>
  );
};

export default withPrivateRoute(EmailProvider);
