import {
  getFormattedDate,
  capitalizeFirstLetter,
  getMonthShortName,
} from "./utils";
import { useState } from "react";

const ConditionsTable = ({ conditions }) => {
  const [activeNote, setActiveNote] = useState();
  const [activeConditions, setActiveConditions] = useState([]);
  const [noteValue, setNoteValue] = useState("");

  const handleAddNote = (e) => {
    const name = e.currentTarget.name;
    if (activeNote === name) {
      setActiveConditions([]);
      setActiveNote(null);
    } else {
      setActiveConditions([name]);
      setActiveNote(name);
    }
  };
  const renderConditionDetails = (e) => {
    const { code, requestAndDispense, codeDisplay } = e;
    return (
      <div
        className={`${
          activeConditions.includes(code) ? "block" : "hidden"
        } mt-6 bg-gray-100 p-6`}
      >
        <div className="mb-2 text-xs">{codeDisplay}</div>
      </div>
    );
  };

  const handleClick = (e) => {
    const conditionCode = e.currentTarget.name;
    if (activeConditions.includes(conditionCode)) {
      setActiveConditions((active) =>
        active.filter((code) => code !== conditionCode)
      );
      setActiveNote(null);
      return;
    }
    setActiveNote(null);
    setActiveConditions([...activeConditions, conditionCode]);
  };

  const renderConditionList = () => {
    return (
      <div className="w-full  ">
        {conditions.map((e, i) => {
          return (
            <div key={i} className="border-b last:border-b-0 py-4 ">
              <div className="relative">
                <button
                  onClick={handleClick}
                  name={e.code}
                  className=" text-left relative flex w-full flex-row "
                >
                  <div className="pr-6 w-72 text-ellipsis overflow-hidden whitespace-nowrap">
                    {e.codeDisplay}
                  </div>{" "}
                  <div className="w-48 ">
                    {e.clinicalStatus
                      ? capitalizeFirstLetter(e.clinicalStatus)
                      : null}
                  </div>
                  <div className="w-48 ">
                    {e.verificationStatus
                      ? capitalizeFirstLetter(e.verificationStatus)
                      : null}
                  </div>
                </button>
                {/* <div className="absolute top-1/2 right-0 -translate-y-1/2 flex-row items-center justify-end ">
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
                </div> */}
              </div>

              <div>{renderConditionDetails(e)}</div>
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
        <div className="w-72 font-bold">Condition</div>

        <div className="w-48 font-bold">Clinical Status</div>
        <div className="w-48 font-bold">Verification Status</div>
      </div>
      <div className="flex flex-row">{renderConditionList()}</div>
    </div>
  );
};

export default ConditionsTable;

//   export interface Condition {
//     uid?: string;
//     fhirReference?: string;
//     insuranceProviderUid?: string;
//     source?: string;
//     clinicalStatus?: string;
//     verificationStatus?: string;
//     category?: string;
//     code?: string;
//     codeDisplay?: string; // the condition
//     userUid?: string;
//   }
