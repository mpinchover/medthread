import {
  getFormattedDate,
  capitalizeFirstLetter,
  getMonthShortName,
} from "./utils";
import { useState } from "react";

const ImmunizationsTable = ({ immunizations }) => {
  const [activeImmunizations, setActiveImmunizations] = useState([]);
  const [activeNote, setActiveNote] = useState();
  const [noteValue, setNoteValue] = useState("");

  const handleAddNote = (e) => {
    const name = e.currentTarget.name;
    if (activeNote === name) {
      setActiveImmunizations([]);
      setActiveNote(null);
    } else {
      setActiveImmunizations([name]);
      setActiveNote(name);
    }
  };

  const handleClick = (e) => {
    const immunizationCode = e.currentTarget.name;
    if (activeImmunizations.includes(immunizationCode)) {
      setActiveImmunizations((active) =>
        active.filter((code) => code !== immunizationCode)
      );
      setActiveNote(null);
      return;
    }
    setActiveNote(null);
    setActiveImmunizations([...activeImmunizations, immunizationCode]);
  };

  const handleSaveNote = () => {};

  const renderImmunizationDetails = (e) => {
    const { code, requestAndDispense, codeDisplay } = e;
    return (
      <div
        className={`${
          activeImmunizations.includes(code) ? "block" : "hidden"
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
                  name={e.code}
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
              <div>{renderImmunizationDetails(e)}</div>
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
//     flexpaResourceId?: string;
//     insuranceProviderUid?: string;
//     source?: string;
//     status?: string;
//     code?: string;
//     codeDisplay?: string; // the vaccine display
//     occurenceDateTime?: string;
//     userUid?: string;
//   }
