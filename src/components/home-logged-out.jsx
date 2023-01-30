import { useNavigate } from "react-router-dom";

const LoggedOutHome = () => {
  const navigate = useNavigate();
  return (
    <div className=" relative text-gray-300 bg-cover bg-gradient-to-r from-cyan-600 to-blue-500 px-2 md:px-28 p-2 md:py-10 flex flex-1 flex-col">
      <div className="px-2 md:px-none  flex flex-col w-full md:w-auto md:items-start items-center absolute left-1/2 md:left-28  top-1/3 -translate-x-1/2 md:translate-x-0 -translate-y-1/3 space-y-6 md:space-y-4">
        <div className="text-center  md:text-left text-3xl md:text-5xl font-thin md:w-124">
          Complete medical history in one place
        </div>
        <div className="text-center md:text-left  text-xl md:text-3xl md:w-124">
          Patient medical history for actionable insights in under a minute.
        </div>

        <a
          href="mailto:info@usemedthread.com"
          // onClick={() => navigate("/patient-login")}
          className="hover:bg-white transition-all duration-500 hover:text-gray-500 block text-center  p-3 px-8 font-bold border rounded-lg "
        >
          Request a demo
        </a>
      </div>
    </div>
  );
};

export default LoggedOutHome;
