import {
  getFormattedDate,
  capitalizeFirstLetter,
  getMonthShortName,
} from "./utils";
import { useState } from "react";

const ImmunizationsTable = ({ immunizations }) => {
  const [activeImmunizations, setActiveImmunizations] = useState([]);
  const [activeNote, setActiveNote] = useState();

  const handleClick = (e) => {
    const immunizationUuid = e.currentTarget.name;
    if (activeImmunizations.includes(immunizationUuid)) {
      setActiveImmunizations((active) =>
        active.filter((uuid) => uuid !== immunizationUuid)
      );

      return;
    }

    setActiveImmunizations([...activeImmunizations, immunizationUuid]);
  };

  const renderImmunizationDetails = (e) => {
    const { uuid, requestAndDispense, codeDisplay } = e;
    return (
      <div
        className={`${
          activeImmunizations.includes(uuid) ? "block" : "hidden"
        } mt-6 bg-gray-100 p-6`}
      >
        <div className="mb-2 text-xs">{codeDisplay}</div>
      </div>
    );
  };

  const renderImmunizationsList = () => {
    return (
      <div className="w-full  ">
        {immunizations.map((e, i) => {
          return (
            <div key={i} className="border-b last:border-b-0 py-4 ">
              <div className="relative">
                <button
                  onClick={handleClick}
                  name={e.uuid}
                  // disabled
                  className=" text-left relative flex w-full flex-row "
                >
                  <div className="w-72 pr-6 text-ellipsis overflow-hidden whitespace-nowrap ">
                    {e.codeDisplay}
                  </div>
                  <div className="w-48 ">
                    {getFormattedDate(e.occurenceDateTime)}
                  </div>
                  <div className="w-48 ">{capitalizeFirstLetter(e.status)}</div>
                </button>
              </div>
              <div>{renderImmunizationDetails(e)}</div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="py-4 text-xs w-full text-md px-28 ">
      <div className="flex flex-row">
        <div className="w-72 font-bold">Immunization</div>

        <div className="w-48 font-bold">Date received</div>
        <div className="w-48 font-bold">Status</div>
      </div>
      <div className="flex flex-row">{renderImmunizationsList()}</div>
    </div>
  );
};

export default ImmunizationsTable;

//   export interface Immunization {
//     uid?: string;
//     fhirReference?: string;
//     insuranceProviderUid?: string;
//     source?: string;
//     status?: string;
//     code?: string;
//     codeDisplay?: string; // the vaccine display
//     occurenceDateTime?: string;
//     userUid?: string;
//   }
