import {
  getFormattedDate,
  capitalizeFirstLetter,
  getMonthShortName,
} from "./utils";
import { useState } from "react";

const ConditionsTable = ({ conditions }) => {
  const renderConditionList = () => {
    return (
      <div className="w-full  ">
        {conditions.map((e, i) => {
          return (
            <div key={i} className="border-b last:border-b-0 py-4 ">
              <button
                disabled
                // onClick={handleClick}
                name={e.code}
                className=" text-left relative flex w-full flex-row "
              >
                <div className="flex-1 relative">
                  <div>{e.codeDisplay}</div>{" "}
                </div>

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
          );
        })}
      </div>
    );
  };

  return (
    <div className="py-4  w-full text-md px-28 ">
      <div className="flex flex-row">
        <div className="flex-1 font-bold">Condition</div>

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
//     flexpaResourceId?: string;
//     insuranceProviderUid?: string;
//     source?: string;
//     clinicalStatus?: string;
//     verificationStatus?: string;
//     category?: string;
//     code?: string;
//     codeDisplay?: string; // the condition
//     userUid?: string;
//   }
