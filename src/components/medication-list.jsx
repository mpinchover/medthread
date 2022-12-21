import { useEffect, useState, useContext } from "react";
import {
  medicationsCallback,
  saveMedicationCallback,
  removeMedicationCallback,
} from "../recoil/medications/medications";
import { useRecoilCallback, useSetRecoilState } from "recoil";
import { withPrivateRoute } from "./hocs";
import { AiOutlinePlus } from "react-icons/ai";
import { getAuth } from "firebase/auth";
import { Medication, MedHeader } from "./common";
import { useNavigate } from "react-router-dom";
import { IoIosOptions } from "react-icons/io";
import { RiSendPlaneFill } from "react-icons/ri";
import AddMedicationModal from "./medication-modal-add";
import AccountModal from "./account-modal";
import SendMedicationsModal from "./medication-modal-send-meds";
import { FirebaseContext } from "../firebase/firebase-context";
import { accountSettingsState } from "../recoil/account/account";

const MedicationList = ({
  meds,
  onChange,
  searchTerm,
  authUser,
  activePatient,
  accountSettings,
}) => {
  const { role, account } = authUser;
  const [medToBeUpdated, setMedToBeUpdated] = useState(null);
  const [isAddMedModalOpen, setIsAddMedModalOpen] = useState(false);
  const [isSendMedsModalOpen, setIsSendMedsModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(true);
  const removeMedication = useRecoilCallback(removeMedicationCallback);

  const saveMedication = useRecoilCallback(saveMedicationCallback);

  const handleChange = (e) => {
    const { value } = e.target;
    onChange(value);
  };

  const { setIsModalOpen } = useContext(FirebaseContext);

  const handleAddMedModalClose = () => {
    setMedToBeUpdated(null);
    setIsAddMedModalOpen(false);
    if (isAddMedModalOpen) {
      setIsModalOpen(false);
    }
  };

  const handleSendMedsModalClose = () => {
    if (isSendMedsModalOpen) {
      setIsModalOpen(false);
    }
    setIsSendMedsModalOpen(false);
  };

  const handleToggleOpen = (e) => {
    const name = e.currentTarget.name;

    if (name === "send_medications") {
      setIsSendMedsModalOpen(!isSendMedsModalOpen);
    } else {
      setIsAddMedModalOpen(!isAddMedModalOpen);
    }
    setIsModalOpen(!isAddMedModalOpen);
  };

  const onSendMedications = (e) => {
    e.preventDefault();
    setIsSendMedsModalOpen(false);
    setIsModalOpen(false);
  };

  const handleRemoveMedication = (uid) => {
    setMedToBeUpdated(null);
    setIsAddMedModalOpen(false);
    setIsModalOpen(false);
    removeMedication(uid);
  };

  const onSave = (params) => {
    setMedToBeUpdated(null);
    setIsAddMedModalOpen(false);
    setIsModalOpen(false);
    saveMedication(params);
  };

  const renderMedicationList = () => {
    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }

    function getMonthShortName(monthNo) {
      const date = new Date();
      date.setMonth(monthNo);

      return date.toLocaleString("en-US", { month: "short" });
    }

    const handleUpdateMedication = (med) => {
      setMedToBeUpdated(med);
      setIsAddMedModalOpen(true);
      setIsModalOpen(true);
    };

    const getFormattedDate = (date) => {
      if (!date) return null;
      const dateObj = new Date(date);

      const month = getMonthShortName(dateObj.getMonth());
      const day = dateObj.getDate();
      const year = dateObj.getFullYear();

      const formattedDate = `${month}, ${day}, ${year}`;
      return formattedDate;
    };

    return (
      <ul className="w-full">
        {meds.map((e, i) => {
          return (
            <li
              key={i}
              className="relative flex w-full flex-row border-b last:border-b-0 py-6"
            >
              <div className="flex-1 relative">
                <div>{e.medicationName}</div>{" "}
                <button
                  onClick={() => handleUpdateMedication(e)}
                  className={`${
                    e.source === "PATIENT" ? "absolute" : "hidden"
                  } left-0 text-sm  text-blue-400`}
                >
                  Update
                </button>
              </div>

              <div className="w-48 ">{getFormattedDate(e.dateStarted)}</div>
              <div className="w-16 ">{capitalizeFirstLetter(e.source)}</div>
            </li>
          );
        })}
      </ul>
    );
  };

  const navigate = useNavigate();

  return (
    <div className="flex-1 relative ">
      <div className="flex-1 relative">
        <div className="py-6   px-2 md:px-28 flex flex-row relative">
          <input
            // onChange={(e) => setSearchTerm(e.target.value)}
            onChange={(e) => onChange(e.target.value)}
            value={searchTerm}
            className=" focus:outline-none p-4 text-sm border rounded-full flex-1 "
            placeholder="Search medications"
          />
          {role === "PATIENT" ? (
            <div className="flex flex-row ">
              <button
                name="send_medications"
                onClick={handleToggleOpen}
                // ref={mainDropdownRefBtn}
                className="ml-4 flex flex-row border rounded-full py-4 px-6 items-center"
              >
                <RiSendPlaneFill size={20} />
                <span className="text-xs ml-1">Send medications</span>
              </button>

              <button
                name="add_medication"
                onClick={handleToggleOpen}
                //  ref={mainDropdownRefBtn}
                className="ml-2 text-white bg-black flex flex-row border rounded-full py-4 px-6 items-center"
              >
                <AiOutlinePlus size={20} />
                <span className="text-xs ml-1">Add medication</span>
              </button>
            </div>
          ) : null}
        </div>

        {/* {renderMedicationList()} */}
      </div>
      <div className="py-4  w-full text-md px-2 md:px-28 ">
        <div className="flex flex-row">
          <div className="flex-1 font-bold">Medication</div>

          <div className="w-48 font-bold">Date requested</div>
          <div className="w-16 font-bold">Source</div>
        </div>
        <div className="flex flex-row">{renderMedicationList()}</div>
      </div>
      <AddMedicationModal
        medToBeUpdated={medToBeUpdated}
        isOpen={isAddMedModalOpen}
        onSave={(params) => onSave(params)}
        onClose={handleAddMedModalClose}
        onRemoveMedication={(uid) => handleRemoveMedication(uid)}
      />
      <SendMedicationsModal
        healthcareProviders={accountSettings.healthcareProviders}
        isOpen={isSendMedsModalOpen}
        onSend={onSendMedications}
        onClose={handleSendMedsModalClose}
      />
      {/* <AccountModal isOpen={true} /> */}
    </div>
  );
};

export default withPrivateRoute(MedicationList);
