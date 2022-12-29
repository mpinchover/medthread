import {
  getFormattedDate,
  capitalizeFirstLetter,
  getMonthShortName,
} from "./utils";
import { useState } from "react";

const ProceduresTable = ({ procedures }) => {
  const [activeProcedures, setActiveProcedures] = useState([]);

  const renderProcedureDetails = (procedure) => {
    return (
      <div
        className={`${
          activeProcedures.includes(procedure.code) ? "block" : "hidden"
        } mt-2 bg-gray-100 p-4`}
      >
        <div className="flex flex-row">
          <div className="font-bold text-sm w-52">Recorder</div>
          <div className="font-bold text-sm w-52">Performer</div>
        </div>
        <div className="flex flex-row  py-2 border-b last:border-none">
          <div className=" text-sm w-52">
            {procedure.recorder
              ? capitalizeFirstLetter(procedure.recorder)
              : null}
          </div>
          <div className=" text-sm w-52">
            {procedure.performer
              ? capitalizeFirstLetter(procedure.performer)
              : null}
          </div>
        </div>
      </div>
    );
  };

  const renderProceduresList = () => {
    const handleClick = (e) => {
      const procedureCode = e.currentTarget.name;
      if (activeProcedures.includes(procedureCode)) {
        setActiveProcedures((active) =>
          active.filter((code) => code !== procedureCode)
        );
        return;
      }
      setActiveProcedures([...activeProcedures, procedureCode]);
    };
    return (
      <div className="w-full  ">
        {procedures.map((e, i) => {
          return (
            <div key={i} className="border-b last:border-b-0 py-4 ">
              <button
                onClick={handleClick}
                name={e.code}
                className=" text-left relative flex w-full flex-row "
              >
                <div className="flex-1 relative">
                  <div>{e.codeDisplay}</div>{" "}
                </div>

                <div className="w-48 ">{capitalizeFirstLetter(e.status)}</div>
                <div className="w-48 ">
                  {getFormattedDate(e.performedDateTime)}
                </div>
              </button>
              <div>{renderProcedureDetails(e)}</div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="py-4  w-full text-md px-28 ">
      <div className="flex flex-row">
        <div className="flex-1 font-bold">Procedure</div>

        <div className="w-48 font-bold">Status</div>
        <div className="w-48 font-bold">Date performed</div>
      </div>
      <div className="flex flex-row">{renderProceduresList()}</div>
    </div>
  );
};

export default ProceduresTable;

//   export interface Procedure {
//     uid?: string;
//     flexpaResourceId?: string;
//     insuranceProviderUid?: string;
//     source?: string;
//     status?: string;
//     code?: string;
//     codeDisplay?: string; // the procedure display
//     performedDateTime?: string;
//     recorder?: string;
//     recorderIdentifier?: string;
//     performer?: string;
//     performerIdentifier?: string;
//     userUid?: string;
//   }
