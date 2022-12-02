import { TextInput, DropDown, DatePicker } from "./common";
import { useState, useEffect } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { useRecoilCallback, useRecoilValue } from "recoil";
import {
  addMedicationCallback,
  isAddingMedicationState,
} from "../recoil/medications/medications";
import { getAuth } from "firebase/auth";
import { AiFillCheckCircle, AiFillCloseCircle } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { withPrivateRoute } from "./hocs";
const medIdleState = {
  itemName: "",
  dose: "",
  prescribedBy: "",
  dateStarted: "",
  status: "",
  medicationType: "",
};
const AddMedication = () => {
  const isAddingMedication = useRecoilValue(isAddingMedicationState);

  const [newMed, setNewMed] = useState(medIdleState);
  const navigate = useNavigate();
  const addMedication = useRecoilCallback(addMedicationCallback);
  const [addMedicationStatus, setAddMedicationStatus] = useState("IDLE");
  const [disabled, setDisabled] = useState(false);

  const handleAddMedicationEvent = (e) => {
    if (e.type === "FAILED_ADD_MEDICATION_EVENT") {
      toast.error("Failed to add medication", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }

    toast.success("Added medication", {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

    setTimeout(() => {
      navigate(-1);
    }, 1000);
  };

  const getCurrentDate = () => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var yyyy = today.getFullYear();

    today = yyyy + "-" + mm + "-" + dd;
    return today;
  };
  useEffect(() => {
    document.addEventListener(
      "SUCCESS_ADD_MEDICATION_EVENT",
      handleAddMedicationEvent
    );
    document.addEventListener(
      "FAILED_ADD_MEDICATION_EVENT",
      handleAddMedicationEvent
    );
    document.addEventListener(
      "PENDING_ADD_MEDICATION_EVENT",
      handleAddMedicationEvent
    );

    setNewMed({
      ...newMed,
      dateStarted: getCurrentDate(),
      status: "ACTIVE",
    });

    return () => {
      document.removeEventListener(
        "SUCCESS_ADD_MEDICATION_EVENT",
        handleAddMedicationEvent
      );
      document.removeEventListener(
        "FAILED_ADD_MEDICATION_EVENT",
        handleAddMedicationEvent
      );
      document.removeEventListener(
        "PENDING_ADD_MEDICATION_EVENT",
        handleAddMedicationEvent
      );
    };
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setDisabled(true);

    const user = getAuth().currentUser;
    addMedication({
      ...newMed,
      userUid: user.uid,
    });
  };

  const handleDropdownChange = (selection) => {
    setNewMed({
      ...newMed,
      status: selection,
    });
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setNewMed({
      ...newMed,
      [name]: value,
    });
  };

  const handleCancel = (e) => {
    e.preventDefault();
    navigate(-1);
  };

  const renderFooter = () => {
    if (isAddingMedication) {
      return (
        <div className=" flex flex-row items-center ">
          <div className="animate-spin mr-2">
            <div className=" rounded-full border border-blue-200 border-t-blue-400  w-4 h-4"></div>
          </div>
          <span className="text-blue-400">Saving medication...</span>
        </div>
      );
    }
    return (
      <>
        <button
          type="submit"
          onClick={handleSave}
          className=" rounded-sm px-6 py-2 text-white bg-blue-600 "
        >
          Save
        </button>
        <button
          onClick={handleCancel}
          className="ml-4  rounded-sm px-6 py-2 border"
        >
          Cancel
        </button>
      </>
    );
  };

  return (
    <div className="flex-1  p-2 md:px-28 md:py-10 bg-gray-100 ">
      <div className="bg-white p-4 md:p-10 rounded-sm border">
        <div className="text-xl">Add medication</div>
        <div className="border border-b-0 my-4"></div>
        <form onSubmit={handleSave}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6">
            <TextInput
              disabled={disabled}
              name="itemName"
              onChange={handleChange}
              placeholder="e.g, Tylenol"
              value={newMed["itemName"]}
              label={"Medication name"}
            />
            <TextInput
              disabled={disabled}
              name="prescribedBy"
              onChange={handleChange}
              placeholder="e.g, Dr. Catherine Muntz"
              value={newMed.prescribedBy}
              label={"Prescribed by"}
            />
            <DatePicker
              disabled={disabled}
              name="dateStarted"
              onChange={handleChange}
              value={newMed.dateStarted}
              label={"Date started"}
            />
            <DropDown
              disabled={disabled}
              name="status"
              onChange={handleDropdownChange}
              value={newMed.status}
              defaultValue={"ACTIVE"}
              options={["ACTIVE", "NOT ACTIVE"]}
              label={"Status"}
            />
            <TextInput
              disabled={disabled}
              name="dose"
              onChange={handleChange}
              value={newMed.dose}
              label={"Dose"}
              placeholder={"e.g, 1 pill every 24 hours"}
            />
            <TextInput
              disabled={disabled}
              name="medicationType"
              onChange={handleChange}
              value={newMed.medicationType}
              label={"Medication type"}
              placeholder={"e.g, pill, tablet"}
            />
          </div>

          <div className="border border-b-0 my-4"></div>
          {renderFooter()}
        </form>
      </div>
    </div>
  );
};

export default withPrivateRoute(AddMedication);
