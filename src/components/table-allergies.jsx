import {
  getFormattedDate,
  capitalizeFirstLetter,
  getMonthShortName,
} from "./utils";
import { useState } from "react";

const AllergiesTable = ({ allergies }) => {
  const [activeAllergies, setActiveAllergies] = useState([]);
  const [noteValue, setNoteValue] = useState("");
  const [activeNote, setActiveNote] = useState();

  const renderAllergyDetails = (allergy) => {
    return (
      <div
        className={`${
          activeAllergies.includes(allergy.code) ? "block" : "hidden"
        } mt-2 bg-gray-100 p-4`}
      >
        <div className="mb-2 text-xs">{allergy.codeDisplay}</div>
        <div className="flex flex-row">
          <div className="font-bold text-sm w-52">Clinical status</div>
          <div className="font-bold text-sm w-52">Verification status</div>
          <div className="font-bold text-sm w-52">Recorder</div>

          <div className="font-bold text-sm w-52">Asserter</div>
        </div>
        <div className="flex flex-row  py-2 border-b last:border-none">
          <div className=" text-sm w-52">
            {allergy.clinicalStatus
              ? capitalizeFirstLetter(allergy.clinicalStatus)
              : null}
          </div>
          <div className=" text-sm w-52">
            {allergy.verificationStatus
              ? capitalizeFirstLetter(allergy.verificationStatus)
              : null}
          </div>

          <div className=" text-sm w-52">{allergy.recorder}</div>
          <div className=" text-sm w-52">{allergy.asserter}</div>
        </div>
      </div>
    );
  };

  const handleAddNote = (e) => {
    const name = e.currentTarget.name;
    if (activeNote === name) {
      setActiveAllergies([]);
      setActiveNote(null);
    } else {
      setActiveAllergies([name]);
      setActiveNote(name);
    }
  };

  const renderAllergiesList = () => {
    const handleClick = (e) => {
      const allergyCode = e.currentTarget.name;
      if (activeAllergies.includes(allergyCode)) {
        setActiveAllergies((active) =>
          active.filter((code) => code !== allergyCode)
        );
        setActiveNote(null);
        return;
      }
      setActiveNote(null);
      setActiveAllergies([...activeAllergies, allergyCode]);
    };
    return (
      <div className="w-full  ">
        {allergies.map((e, i) => {
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
                    {e.reactionManifestation
                      ? capitalizeFirstLetter(e.reactionManifestation)
                      : null}
                  </div>
                  <div className="w-48 ">
                    {getFormattedDate(e.onsetDateTime)}
                  </div>
                  <div className="w-48 ">
                    {getFormattedDate(e.recordedDate)}
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
              <div>{renderAllergyDetails(e)}</div>
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
        <div className="w-72 font-bold">Allergy</div>

        <div className="w-48 font-bold">Manifestation</div>
        <div className="w-48 font-bold">Onset date</div>
        <div className="w-48 font-bold">Recorded date</div>
      </div>
      <div className="flex flex-row">{renderAllergiesList()}</div>
    </div>
  );
};

export default AllergiesTable;

//   export interface AllergyIntolerance {
//     uid?: string;
//     flexpaResourceId?: string;
//     insuranceProviderUid?: string;
//     source?: string;
//     clinicalStatus?: string;
//     verificationStatus?: string;
//     code?: string; // the code of what is causing the reaction
//     codeDisplay?: string; // the name of the item
//     onsetDateTime?: string;
//     recordedDate?: string;
//     recorder?: string;
//     asserter?: string;
//     reactionManifestation?: string;
//     recorderIdentifier?: string;
//     asserterIdentifier?: string;
//     userUid?: string;
//   }
