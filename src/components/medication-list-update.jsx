import { TextInput, DropDown, DatePicker } from "./common";
import { FaTrashAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import {
  getMedicationCallback,
  medicationBeingUpdatedState,
  removeMedicationCallback,
  getMedicationForUpdateCallback,
  loadingGetMedicationState,
  medicationBeingUpdatedValuesState,
  updateMedicationCallback,
  isRemovingMedicationState,
  isUpdatingMedicationState,
} from "../recoil/medications/medications";
import { useRecoilValue, useRecoilCallback, useRecoilState } from "recoil";
import { navigate, useNavigate, useSearchParams } from "react-router-dom";
import { LoadingWindow } from "./common";
import { AiFillCheckCircle, AiFillCloseCircle } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import { withPrivateRoute } from "./hocs";
const UpdateMedication = () => {
  const navigate = useNavigate();

  const isRemovingMedication = useRecoilValue(isRemovingMedicationState);
  const isUpdatingMedication = useRecoilValue(isUpdatingMedicationState);

  const loadingGetMedication = useRecoilValue(loadingGetMedicationState);
  const [medUpdateValues, setMedUpdateValues] = useRecoilState(
    medicationBeingUpdatedValuesState
  );
  const [medBeingUpdated, setMedBeingUpdated] = useRecoilState(
    medicationBeingUpdatedState
  );
  const [updateMedicationStatus, setUpdateMedicationStatus] = useState("IDLE");
  const [disabled, setDisabled] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const medId = searchParams.get("medId");

  const updateMedication = useRecoilCallback(updateMedicationCallback);
  const getMedicationForUpdate = useRecoilCallback(
    getMedicationForUpdateCallback
  );
  const removeMedication = useRecoilCallback(removeMedicationCallback);

  const handleUpdateMedicationEvent = (e) => {
    setUpdateMedicationStatus(e.type);
    setDisabled(true);
    if (
      e.type === "FAILED_UPDATE_MEDICATION_EVENT" ||
      e.type === "FAILED_REMOVE_MEDICATION_EVENT"
    ) {
      if (e.type === "FAILED_UPDATE_MEDICATION_EVENT") {
        toast.error("Failed to update medication", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
        toast.error("Failed to remove medication", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
      setDisabled(false);

      setTimeout(() => {
        setUpdateMedicationStatus("IDLE");
      }, 1000);
      return;
    }

    if (e.type === "SUCCESS_UPDATE_MEDICATION_EVENT") {
      toast.success("Medication saved", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
    if (e.type === "SUCCESS_REMOVE_MEDICATION_EVENT") {
      toast.success("Medication removed", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }

    setTimeout(() => {
      navigate(-1);
    }, 1000);
  };

  useEffect(() => {
    getMedicationForUpdate(medId);

    // add event listern
    document.addEventListener(
      "SUCCESS_UPDATE_MEDICATION_EVENT",
      handleUpdateMedicationEvent
    );
    document.addEventListener(
      "FAILED_UPDATE_MEDICATION_EVENT",
      handleUpdateMedicationEvent
    );

    document.addEventListener(
      "SUCCESS_REMOVE_MEDICATION_EVENT",
      handleUpdateMedicationEvent
    );
    document.addEventListener(
      "FAILED_REMOVE_MEDICATION_EVENT",
      handleUpdateMedicationEvent
    );

    return () => {
      document.removeEventListener(
        "SUCCESS_UPDATE_MEDICATION_EVENT",
        handleUpdateMedicationEvent
      );
      document.removeEventListener(
        "FAILED_UPDATE_MEDICATION_EVENT",
        handleUpdateMedicationEvent
      );

      document.removeEventListener(
        "SUCCESS_REMOVE_MEDICATION_EVENT",
        handleUpdateMedicationEvent
      );
      document.removeEventListener(
        "FAILED_REMOVE_MEDICATION_EVENT",
        handleUpdateMedicationEvent
      );
    };
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    updateMedication({
      ...medBeingUpdated,
      ...medUpdateValues,
    });
  };

  const handleDropdownChange = (selection) => {
    setMedUpdateValues({
      ...medUpdateValues,
      status: selection,
    });
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setMedUpdateValues({
      ...medUpdateValues,
      [name]: value,
    });
  };

  const renderFooter = () => {
    if (isUpdatingMedication) {
      return (
        <div className=" flex flex-row items-center ">
          <div className="animate-spin mr-2">
            <div className=" rounded-full border border-blue-200 border-t-blue-400  w-4 h-4"></div>
          </div>
          <span className="text-blue-400">Saving medication...</span>
        </div>
      );
    }

    if (isRemovingMedication) {
      return (
        <div className=" flex flex-row items-center ">
          <div className="animate-spin mr-2">
            <div className=" rounded-full border border-blue-200 border-t-blue-400  w-4 h-4"></div>
          </div>
          <span className="text-blue-400">Removing medication...</span>
        </div>
      );
    }
    return (
      <>
        <button
          onClick={handleUpdate}
          className=" rounded-sm px-6 py-2 text-white bg-blue-600 "
        >
          Save
        </button>
        <button
          onClick={() => navigate(-1)}
          className="ml-4  rounded-sm px-6 py-2 border"
        >
          Cancel
        </button>
      </>
    );
  };

  if (loadingGetMedication || medUpdateValues === null)
    return <LoadingWindow display={"Getting medication..."} />;

  return (
    <div className="flex-1 p-2 md:px-28 md:py-10 bg-gray-100 ">
      <div className="bg-white p-4 md:p-10 rounded-sm border">
        <div className="text-xl">Update medication</div>
        <div className="border border-b-0 my-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2  gap-y-6">
          <TextInput
            disabled={disabled}
            name="medicationName"
            onChange={handleChange}
            placeholder="e.g, Tylenol"
            value={medUpdateValues?.medicationName}
            label={"Medication name"}
          />
          <TextInput
            disabled={disabled}
            name="prescribedBy"
            onChange={handleChange}
            placeholder="e.g, Dr. Catherine Muntz"
            value={medUpdateValues?.prescribedBy}
            label={"Prescribed by"}
          />
          <DatePicker
            disabled={disabled}
            name="dateStarted"
            onChange={handleChange}
            value={medUpdateValues.dateStarted}
            label={"Date started"}
          />
          <DropDown
            disabled={disabled}
            name="status"
            onChange={handleDropdownChange}
            value={medUpdateValues?.status}
            options={["ACTIVE", "NOT ACTIVE"]}
            label={"Status"}
          />
          <TextInput
            disabled={disabled}
            name="dose"
            onChange={handleChange}
            value={medUpdateValues.dose}
            label={"Dose"}
            placeholder={"e.g, 1 pill every 24 hours"}
          />
          <TextInput
            disabled={disabled}
            name="medicationType"
            onChange={handleChange}
            value={medUpdateValues.medicationType}
            label={"Medication type"}
            placeholder={"e.g, pill, tablet"}
          />
        </div>
        <div className="flex flex-row text-red-600 items-center mt-6">
          <FaTrashAlt />
          <button onClick={() => removeMedication(medId)} className="ml-1">
            Remove medication
          </button>
        </div>
        <div className="border border-b-0 my-4"></div>
        {renderFooter()}
      </div>
    </div>
  );
};

export default withPrivateRoute(UpdateMedication);
