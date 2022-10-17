import React from "react";

const recentMeds = [
  {
    name: "CODEINE",
    date: "2 months ago",
  },
  {
    name: "VICODIN",
    date: "1 year ago",
  },
  {
    name: "METHADONE",
    date: "Jan 1, 2019",
  },
];

const recentProcedures = [
  {
    name: "BIOPSY OF NERVE",
    date: "Jan 1, 20202",
  },
];

const recentImmunizations = [
  {
    name: "Haemophilus influenzae",
    date: "6 months ago",
  },
];
const ActivePatientHeader = () => {
  return (
    <div className="border  ">
      <section className="text-lg bg-gray-100 px-2 py-2  ">
        Wellington O'Conner Recent History
      </section>

      <section className="px-2 py-2 flex flex-row">
        <div>
          <div className="w-60 font-bold">Medications</div>
          <ActivePatientHeaderList items={recentMeds} />
        </div>
        <div>
          <div className="w-60 font-bold">Procedures</div>
          <ActivePatientHeaderList items={recentProcedures} />
        </div>
        <div>
          <div className="w-60 font-bold">Immunizations</div>
          <ActivePatientHeaderList items={recentImmunizations} />
        </div>
      </section>
    </div>
  );
};

const ActivePatientHeaderList = (props) => {
  const { items } = props;

  return (
    <ul className="py-2">
      {items.map((e, i) => {
        return (
          <li key={i} className="mb-2 last:mb-0 flex flex-col">
            <div className="  rounded-sm text-lg inline-block ">{e.name}</div>
            <div className="  rounded-sm text-xs inline-block ">{e.date}</div>
          </li>
        );
      })}
    </ul>
  );
};
export default ActivePatientHeader;
