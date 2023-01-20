import { useEffect, useState, useContext } from "react";
import {
  medicationsCallback,
  saveMedicationCallback,
  removeMedicationCallback,
} from "../recoil/medications/medications";
import {
  useRecoilCallback,
  useSetRecoilState,
  useRecoilValue,
  useRecoilState,
} from "recoil";
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
import MedicationListFilterBar from "./medication-list-filter-bar";
import {
  recordsActiveCategoryState,
  recordsSearchQueryState,
} from "../recoil/claims/claims";
import MedicationsTable from "./table-medications";
import AllergiesTable from "./table-allergies";
import ImmunizationsTable from "./table-immunizations";
import ConditionsTable from "./table-conditions";
import ProceduresTable from "./table-procedures";
import { modalState } from "../recoil/utils/utils";
import PatientTimeline from "./patient-timeline";

const MedicationList = ({
  meds,
  onChange,
  searchTerm,
  authUser,
  activePatient,
  accountSettings,
  claimsAllergyIntolerance,
  claimsConditions,
  claimsImmunizations,
  claimsProcedures,
  claimsDerivedMedications,
}) => {
  const [medToBeUpdated, setMedToBeUpdated] = useState(null);
  const [isAddMedModalOpen, setIsAddMedModalOpen] = useState(false);

  const removeMedication = useRecoilCallback(removeMedicationCallback);
  const recordsActiveCategory = useRecoilValue(recordsActiveCategoryState);
  const [modal, setModal] = useRecoilState(modalState);

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
    setModal((prevModal) => {
      return {
        ...prevModal,
        isSendRecordsModalOpen: false,
      };
    });
  };

  // const handleToggleOpen = (e) => {
  //   const name = e.currentTarget.name;

  //   if (name === "SEND_RECORDS") {
  //     setModal((prevModal) => {
  //       return {
  //         ...prevModal,
  //         isSendRecordsModalOpen: true,
  //       };
  //     });
  //   }
  // };

  const onSendMedications = (e) => {
    e.preventDefault();
    setModal((prevModal) => {
      return {
        ...prevModal,
        isSendRecordsModalOpen: false,
      };
    });
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

  const navigate = useNavigate();

  const renderSearchBar = () => {
    if (recordsActiveCategory === "TIMELINE") return null;
    return (
      <div className="mt-6   px-2 md:px-28 flex flex-row relative">
        <input
          // onChange={(e) => setSearchTerm(e.target.value)}
          onChange={(e) => onChange(e.target.value)}
          value={searchTerm}
          className=" focus:outline-none p-4 text-sm border rounded-full flex-1 "
          placeholder="Search records..."
        />
      </div>
    );
  };
  const renderRecordsTable = () => {
    if (recordsActiveCategory === "MEDICATIONS") {
      return <MedicationsTable meds={claimsDerivedMedications} />;
    }
    if (recordsActiveCategory === "ALLERGIES") {
      return <AllergiesTable allergies={claimsAllergyIntolerance} />;
    }

    if (recordsActiveCategory === "IMMUNIZATIONS") {
      return <ImmunizationsTable immunizations={claimsImmunizations} />;
    }

    if (recordsActiveCategory === "CONDITIONS") {
      return <ConditionsTable conditions={claimsConditions} />;
    }

    if (recordsActiveCategory === "PROCEDURES") {
      return <ProceduresTable procedures={claimsProcedures} />;
    }

    if (recordsActiveCategory === "TIMELINE") {
      return <PatientTimeline />;
    }
  };

  return (
    <div className="flex-1 relative ">
      <div className="flex-1 relative">
        <section className="mt-6 px-2">
          <MedicationListFilterBar />
        </section>
        {renderSearchBar()}
        {/* {renderMedicationList()} */}
      </div>

      <div className="py-4  w-full text-md  ">
        {/* <div className="flex flex-row">
          <div className="flex-1 font-bold">Medication</div>

          <div className="w-48 font-bold">Date requested</div>
          <div className="w-16 font-bold">Source</div>
        </div>
        <div className="flex flex-row">{renderMedicationList()}</div> */}
        {renderRecordsTable()}
      </div>
      {/* <AddMedicationModal
        medToBeUpdated={medToBeUpdated}
        isOpen={isAddMedModalOpen}
        onSave={(params) => onSave(params)}
        onClose={handleAddMedModalClose}
        onRemoveMedication={(uid) => handleRemoveMedication(uid)}
      />*/}
      {/* <SendMedicationsModal
        healthcareProviders={accountSettings.healthcareProviders}
        isOpen={modal.isSendRecordsModalOpen}
        onSend={onSendMedications}
        onClose={handleSendMedsModalClose}
      /> */}
      {/* <AccountModal isOpen={true} /> */}
    </div>
  );
};

export default withPrivateRoute(MedicationList);
