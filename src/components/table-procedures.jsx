import {
  getFormattedDate,
  capitalizeFirstLetter,
  getMonthShortName,
} from "./utils";
import { useState } from "react";

const ProceduresTable = ({ procedures }) => {
  const [activeProcedures, setActiveProcedures] = useState([]);
  const [activeNote, setActiveNote] = useState(null);
  const [noteValue, setNoteValue] = useState("");

  const renderProcedureDetails = (procedure) => {
    console.log("PROCEDURE IS");
    console.log(procedure);
    return (
      <div
        className={`${
          activeProcedures.includes(procedure.uid) ? "block" : "hidden"
        } mt-2 bg-gray-100 p-4`}
      >
        <div className="mb-2 text-xs">{procedure.codeDisplay}</div>
        <div className="flex flex-row">
          <div className="font-bold text-xs w-52">Recorder</div>
          <div className="font-bold text-xs w-52">Performer</div>
        </div>
        <div className="flex flex-row  py-2 border-b last:border-none">
          <div className=" text-xs w-52">
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
      const procedureUid = e.currentTarget.name;
      if (activeProcedures.includes(procedureUid)) {
        setActiveProcedures((active) =>
          active.filter((uid) => uid !== procedureUid)
        );

        return;
      }

      setActiveProcedures([...activeProcedures, procedureUid]);
    };
    return (
      <div className="w-full  ">
        {procedures.map((e, i) => {
          return (
            <div key={i} className="border-b last:border-b-0 py-4 ">
              <div className="relative">
                <button
                  onClick={handleClick}
                  name={e.uid}
                  className=" text-left  flex w-full flex-row "
                >
                  <div className="pr-6 w-72 text-ellipsis overflow-hidden whitespace-nowrap">
                    {e.codeDisplay}
                  </div>
                  <div className="w-48 ">{capitalizeFirstLetter(e.status)}</div>
                  <div className="w-48 ">
                    {getFormattedDate(e.performedDateTime)}
                  </div>
                </button>
              </div>
              <div>{renderProcedureDetails(e)}</div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="py-4 text-xs w-full text-md px-28 ">
      <div className="flex flex-row">
        <div className="w-72 font-bold">Procedure</div>

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
//     fhirReference?: string;
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
