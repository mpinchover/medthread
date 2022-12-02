import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PrivateRoute, withPrivateRoute } from "./hocs";
import { IoIosOptions } from "react-icons/io";
const patients = [
  {
    id: 1,
    name: "Mark Horowitz",
    date: "Mon, Sep 22nd, 2020",
  },
  {
    id: 2,
    name: "Linda Ramstein",
    date: "Tue, Aug 20th, 2020",
  },
  {
    id: 3,
    name: "Clarke Kent",
    date: "Wed, June 29th, 2020",
  },
  {
    id: 4,
    name: "Jerry Ronald",
    date: "Mon, June 20th, 2020",
  },
  {
    id: 5,
    name: "Phil Flakes",
    date: "Tue, April 21st, 2020",
  },
  {
    id: 6,
    name: "Ron Raulgon",
    date: "Mon, April 20th, 2020",
  },
  {
    id: 7,
    name: "Linda Ramstein",
    date: "Thur, March 14th, 2020",
  },
  {
    id: 8,
    name: "Clarke Kent",
    date: "Fri, Feb 20th, 2020",
  },
  {
    id: 9,
    name: "Jerry Ronald",
    date: "Wed, Sep 15th, 2019",
  },
  {
    id: 10,
    name: "Muriel Jhonson",
    date: "Tue, Aug 25th, 2019",
  },
];

const PatientFeed = () => {
  const navigate = useNavigate();

  const handleClickpatient = (id) => {
    navigate("/medication-list-provider");
  };

  const [searchTerm, setSearchTerm] = useState("");

  const filteredPatients = patients.filter((item) => {
    return item.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const onChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="py-4 flex flex-1 flex-col">
      <div className="py-4 px-2 md:px-28 flex flex-row relative">
        <input
          value={searchTerm}
          onChange={onChange}
          className=" focus:outline-none p-4 text-sm border rounded-full flex-1 "
          placeholder="Search patients"
        />
        <button
          // onClick={handleToggleOpen}
          // ref={mainDropdownRefBtn}
          className=" flex flex-row border rounded-full py-4 ml-6 px-6 items-center"
        >
          <IoIosOptions size={20} />
          <span className="text-xs ml-1">Filters</span>
        </button>
      </div>

      <ul className="px-28">
        {filteredPatients.map((e, i) => {
          return (
            <li
              onClick={() => handleClickpatient(e.id)}
              key={i}
              id={e.id}
              className={` text-gray-600 hover:opacity-50 cursor-pointer py-4 border-b `}
            >
              <div className="text-md">{e.name}</div>
              <div className="text-xs">last seen on {e.date} </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default withPrivateRoute(PatientFeed);
