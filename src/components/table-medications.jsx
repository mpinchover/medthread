import {
  getFormattedDate,
  capitalizeFirstLetter,
  getMonthShortName,
} from "./utils";
import { useState } from "react";

const MedicationsTable = ({ meds, handleSaveNote }) => {
  const [activeMeds, setActiveMeds] = useState([]);
  const [activeNote, setActiveNote] = useState(null);
  const [noteValue, setNoteValue] = useState("");

  const renderRequestAndDispenseTable = (e) => {
    const { code, requestAndDispense, codeDisplay } = e;
    return (
      <div
        className={`${
          activeMeds.includes(code) ? "block" : "hidden"
        } mt-6 bg-gray-100 p-6`}
      >
        <div className="mb-2 text-xs">{codeDisplay}</div>
        <div className="flex flex-row">
          <div className="font-bold text-sm w-32">Type</div>
          <div className="font-bold text-sm w-32">Date</div>
          <div className="font-bold text-sm w-32">Dosage</div>

          <div className="font-bold text-sm w-32">Days supply</div>
          <div className="font-bold text-sm w-32">Quantity</div>
        </div>
        <div>
          {requestAndDispense.map((e, i) => {
            return (
              <div
                key={i}
                className="flex flex-row  py-2 border-b last:border-none"
              >
                <div className=" text-sm w-32">
                  {capitalizeFirstLetter(e.type)}
                </div>
                <div className=" text-sm w-32">{getFormattedDate(e.date)}</div>

                <div className=" text-sm w-32">{e.dose}</div>
                <div className=" text-sm w-32">{e.daysSupply}</div>
                <div className=" text-sm w-32">{e.quantityValue}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderMedicationList = () => {
    const handleClick = (e) => {
      const medCode = e.currentTarget.name;
      if (activeMeds.includes(medCode)) {
        setActiveMeds((active) => active.filter((code) => code !== medCode));
        setActiveNote(null);
        return;
      }
      setActiveNote(null);
      setActiveMeds([...activeMeds, medCode]);
    };

    const handleAddNote = (e) => {
      const name = e.currentTarget.name;
      if (activeNote === name) {
        setActiveMeds([]);
        setActiveNote(null);
      } else {
        setActiveMeds([name]);
        setActiveNote(name);
      }
    };

    const _handleSaveNote = () => {
      console.log("MEDS");
      console.log(meds[0]);
      // handleSaveNote()
    };

    return (
      <div className="w-full  ">
        {meds.map((e, i) => {
          return (
            <div key={i} className="border-b last:border-b-0 py-6 relative ">
              <div className="relative">
                <button
                  onClick={handleClick}
                  name={e.code}
                  className=" text-left relative flex flex-1 flex-row "
                >
                  <div className="pr-6 w-72 text-ellipsis overflow-hidden whitespace-nowrap">
                    {e.codeDisplay}
                  </div>
                  <div className="pr-6 w-48 ">
                    {getFormattedDate(e.firstFillOn)}
                  </div>
                  <div className="pr-6 w-48 ">
                    {getFormattedDate(e.lastFillOn)}
                  </div>
                  <div className="pr-6 w-48">
                    {getFormattedDate(e.firstRequestedOn)}
                  </div>
                  <div className="pr-6 w-48 ">
                    {getFormattedDate(e.lastRequestedOn)}
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

              <div>{renderRequestAndDispenseTable(e)}</div>
              <div className={`${activeNote === e.code ? "block" : "hidden"}`}>
                <textarea
                  value={noteValue}
                  onChange={(e) => setNoteValue(e.target.value)}
                  className="w-full resize-none mt-6 border focus:outline-none p-6"
                  rows={4}
                />
                <button
                  onClick={_handleSaveNote}
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
        <div className="w-72 font-bold">Medication</div>

        <div className="w-48 font-bold">First fill</div>
        <div className="w-48 font-bold">Last fill</div>
        <div className="w-48 font-bold">First requested</div>
        <div className="w-48 font-bold">Last requested</div>
      </div>
      <div className="flex flex-row">{renderMedicationList()}</div>
    </div>
  );
};

export default MedicationsTable;

// export interface DerivedMedication {
//   lastRequestedOn?: string;
//   firstRequestedOn?: string;
//   lastFillOn?: string;
//   firstFillOn?: string;
//   code?: string; // you can get the patient input from this code, so have like a patient modification, by code
//   codeDisplay?: string;
//   request?: MedicationRequest[];
//   dispense?: MedicationDispense[];
//   quantity?: number; // if med dispense doesn't have it then use med request
//   daysSupply?: number; // if med dispense doesn't have it then use med request
//   dosage?: string;
//   source?: string; // if the patient has modified the derived me by the code then should be claims + patient
// }
