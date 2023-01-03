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

  const handleAddNote = (e) => {
    const name = e.currentTarget.name;
    if (activeNote === name) {
      setActiveProcedures([]);
      setActiveNote(null);
    } else {
      setActiveProcedures([name]);
      setActiveNote(name);
    }
  };

  const renderProcedureDetails = (procedure) => {
    return (
      <div
        className={`${
          activeProcedures.includes(procedure.code) ? "block" : "hidden"
        } mt-2 bg-gray-100 p-4`}
      >
        <div className="mb-2 text-xs">{procedure.codeDisplay}</div>
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
        setActiveNote(null);
        return;
      }
      setActiveNote(null);
      setActiveProcedures([...activeProcedures, procedureCode]);
    };
    return (
      <div className="w-full  ">
        {procedures.map((e, i) => {
          return (
            <div key={i} className="border-b last:border-b-0 py-4 ">
              <div className="relative">
                <button
                  onClick={handleClick}
                  name={e.code}
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
                <div className="absolute top-1/2 right-0 -translate-y-1/2 flex-row items-center justify-end ">
                  {activeNote === e.code ? (
                    <button
                      name={e.code}
                      onClick={handleAddNote}
                      className={`font-bold`}
                    >
                      Cancel
                    </button>
                  ) : (
                    <button
                      name={e.code}
                      onClick={handleAddNote}
                      className={`font-bold`}
                    >
                      Add note
                    </button>
                  )}
                </div>
              </div>
              <div>{renderProcedureDetails(e)}</div>
              <div className={`${activeNote === e.code ? "block" : "hidden"}`}>
                <textarea
                  value={noteValue}
                  onChange={(e) => setNoteValue(e.target.value)}
                  className="w-full resize-none mt-6 border focus:outline-none p-6"
                  rows={4}
                />
                <button
                  //   onClick={handleSaveNote}
                  className="mt-6 p-3 px-8 font-bold border rounded-lg bg-black text-white"
                >
                  Save
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="py-4  w-full text-md px-28 ">
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
