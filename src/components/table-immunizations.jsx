import {
  getFormattedDate,
  capitalizeFirstLetter,
  getMonthShortName,
} from "./utils";
import { useState } from "react";

const ImmunizationsTable = ({ immunizations }) => {
  const [activeImmunizations, setActiveImmunizations] = useState([]);

  const renderImmunizationsList = () => {
    return (
      <div className="w-full  ">
        {immunizations.map((e, i) => {
          return (
            <div key={i} className="border-b last:border-b-0 py-4 ">
              <button
                // onClick={handleClick}
                name={e.code}
                disabled
                className=" text-left relative flex w-full flex-row "
              >
                <div className="flex-1 relative">
                  <div>{e.codeDisplay}</div>{" "}
                </div>

                <div className="w-48 ">
                  {getFormattedDate(e.occurenceDateTime)}
                </div>
                <div className="w-48 ">{capitalizeFirstLetter(e.status)}</div>
              </button>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="py-4  w-full text-md px-28 ">
      <div className="flex flex-row">
        <div className="flex-1 font-bold">Immunization</div>

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
//     flexpaResourceId?: string;
//     insuranceProviderUid?: string;
//     source?: string;
//     status?: string;
//     code?: string;
//     codeDisplay?: string; // the vaccine display
//     occurenceDateTime?: string;
//     userUid?: string;
//   }
