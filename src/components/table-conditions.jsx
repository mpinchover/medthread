import {
  getFormattedDate,
  capitalizeFirstLetter,
  getMonthShortName,
} from "./utils";
import { useState } from "react";

const ConditionsTable = ({ conditions }) => {
  const [activeNote, setActiveNote] = useState();
  const [activeConditions, setActiveConditions] = useState([]);

  const renderConditionDetails = (e) => {
    const { uid, requestAndDispense, codeDisplay } = e;
    return (
      <div
        className={`${
          activeConditions.includes(uid) ? "block" : "hidden"
        } mt-6 bg-gray-100 p-6`}
      >
        <div className="mb-2 text-xs">{codeDisplay}</div>
      </div>
    );
  };

  const handleClick = (e) => {
    const conditionUid = e.currentTarget.name;
    if (activeConditions.includes(conditionUid)) {
      setActiveConditions((active) =>
        active.filter((uid) => uid !== conditionUid)
      );
      return;
    }

    setActiveConditions([...activeConditions, conditionUid]);
  };

  const renderConditionList = () => {
    return (
      <div className="w-full text-xs ">
        {conditions.map((e, i) => {
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
              </div>

              <div>{renderConditionDetails(e)}</div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="py-4 text-xs w-full text-md px-28 ">
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
