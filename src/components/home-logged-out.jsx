import { useNavigate } from "react-router-dom";

const LoggedOutHome = () => {
  const navigate = useNavigate();
  return (
    <div className=" relative text-gray-300 bg-cover bg-homepage-logged-out-image px-2 md:px-28 p-2 md:py-10 flex flex-1 flex-col">
      <div className="px-2 md:px-none  flex flex-col w-full md:w-auto md:items-start items-center absolute left-1/2 md:left-28  top-1/2 -translate-x-1/2 md:translate-x-0 -translate-y-1/2 space-y-6 md:space-y-4">
        <div className="text-center  md:text-left text-3xl md:text-5xl font-thin md:w-124">
          Complete medical history in one place
        </div>
        <div className="text-center md:text-left  text-xl md:text-3xl md:w-124">
          Patient medical history for actionable insights in under a minute.
        </div>

        <button
          onClick={() => navigate("/provider-login")}
          className="block border w-60 p-3 px-8 font-bold  rounded-lg "
        >
          Sign up as a provider
        </button>
        <button
          onClick={() => navigate("/patient-login")}
          className="block  w-60 p-3 px-8 font-bold border rounded-lg "
        >
          Sign up as a patient
        </button>
      </div>
    </div>
  );
};

export default LoggedOutHome;
