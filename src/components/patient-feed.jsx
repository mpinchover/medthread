import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PrivateRoute, withPrivateRoute } from "./hocs";
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
    navigate("/active-patient");
  };

  const [searchTerm, setSearchTerm] = useState("");

  const filteredPatients = patients.filter((item) => {
    return item.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const onChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="px-28 py-4 flex flex-1 flex-col">
      <div>
        <input
          value={searchTerm}
          onChange={onChange}
          className="text-lg focus:outline-none w-full py-2 border-b"
          placeholder={`Search patients...`}
        />
      </div>

      <ul>
        {filteredPatients.map((e, i) => {
          return (
            <li
              onClick={() => handleClickpatient(e.id)}
              key={i}
              id={e.id}
              className={` text-gray-600 hover:opacity-50 cursor-pointer py-4 border-b `}
            >
              <div className="text-lg">{e.name}</div>
              <div className="text-sm">last seen: {e.date} </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default withPrivateRoute(PatientFeed);
