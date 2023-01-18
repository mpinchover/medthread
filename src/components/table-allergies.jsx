import {
  getFormattedDate,
  capitalizeFirstLetter,
  getMonthShortName,
} from "./utils";
import { useState } from "react";

const AllergiesTable = ({ allergies }) => {
  const [activeAllergies, setActiveAllergies] = useState([]);

  const renderAllergyDetails = (allergy) => {
    return (
      <div
        className={`${
          activeAllergies.includes(allergy.uid) ? "block" : "hidden"
        } mt-2 bg-gray-100 p-4 text-xs`}
      >
        <div className="mb-2 text-xs">{allergy.codeDisplay}</div>
        <div className="flex flex-row">
          <div className="font-bold  w-52">Clinical status</div>
          <div className="font-bold w-52">Verification status</div>
          <div className="font-bold w-52">Recorder</div>

          <div className="font-bold w-52">Asserter</div>
        </div>
        <div className="flex flex-row  py-2 border-b last:border-none">
          <div className="  w-52">
            {allergy.clinicalStatus
              ? capitalizeFirstLetter(allergy.clinicalStatus)
              : null}
          </div>
          <div className=" w-52">
            {allergy.verificationStatus
              ? capitalizeFirstLetter(allergy.verificationStatus)
              : null}
          </div>

          <div className="  w-52">{allergy.recorder}</div>
          <div className="  w-52">{allergy.asserter}</div>
        </div>
      </div>
    );
  };

  const renderAllergiesList = () => {
    const handleClick = (e) => {
      const allergyUid = e.currentTarget.name;
      if (activeAllergies.includes(allergyUid)) {
        setActiveAllergies((active) =>
          active.filter((uid) => uid !== allergyUid)
        );

        return;
      }
      setActiveAllergies([...activeAllergies, allergyUid]);
    };
    return (
      <div className="w-full text-xs ">
        {allergies.map((e, i) => {
          return (
            <div key={i} className="border-b last:border-b-0 py-4 ">
              <div className="relative">
                <button
                  onClick={handleClick}
                  name={e.uid}
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
              </div>
              <div>{renderAllergyDetails(e)}</div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="py-4 text-xs w-full text-md px-28 ">
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
//     fhirReference?: string;
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
