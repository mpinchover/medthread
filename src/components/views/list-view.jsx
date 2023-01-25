import { useRecoilValue, useRecoilCallback } from "recoil";
import { useEffect, useState, useRef } from "react";
import { FaPen, FaPlus, FaMinusCircle } from "react-icons/fa";
import {
  getPatientTimelineDataCallback,
  isLoadingTimelineDataState,
  timelineDataState,
} from "../../recoil/timeline/timeline";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { getFormattedDate } from "../utils";
import {
  activeTimelineEventState,
  activeListViewEventsState,
} from "../../recoil/timeline/timeline";
import { useRecoilState } from "recoil";
import { useParams } from "react-router-dom";
import { modalState } from "../../recoil/utils/utils";
import { LoadingWindow } from "../common";
import { authorizedProfileState } from "../../recoil/auth/auth";
const DiagnosisInfo = ({ display, code }) => {
  if (!display) {
    display = code;
  }
  return <div className="text-xs p-4 rounded-md bg-gray-100">{display}</div>;
};

const ProcedureInfo = ({ display }) => {
  return <div className="text-xs p-4 rounded-md bg-gray-100">{display}</div>;
};

const PrescriptionDisplay = ({ display }) => {
  return <div className="text-xs p-4 rounded-md bg-gray-100">{display}</div>;
};

const claimTypeEvent = {
  institutional: {
    title: "Inpatient",
    textColor: "text-red-600",
  },
  oral: {
    title: "Dentist",
    textColor: "text-blue-600",
  },
  pharmacy: {
    title: "Pharmacy",
    textColor: "text-blue-600",
  },
  professional: {
    title: "Outpatient",
    textColor: "text-blue-600",
  },
  vision: {
    title: "Vision",
    textColor: "text-blue-600",
  },
};

const TimelineEventHeader = ({ event, claimType }) => {
  const [activeTimelineEvent, setActiveTimelineEvent] = useRecoilState(
    activeTimelineEventState
  );

  const [activeListViewEvents, setActiveListViewEvents] = useRecoilState(
    activeListViewEventsState
  );

  const isSelected = activeListViewEvents.includes(event?.uid);

  const handleClick = () => {
    setActiveListViewEvents((prevState) => {
      if (prevState.includes(event.uid)) {
        const newActiveElements = prevState.filter((x) => x !== event.uid);
        return newActiveElements;
      } else {
        return [...prevState, event.uid];
      }
    });
  };
  return (
    <button
      onClick={handleClick}
      className={` w-full relative  flex flex-row justify-between`}
    >
      <div className=" items-center flex flex-row">
        <div className="font-thin mr-2 ">
          {isSelected ? <AiOutlineMinus /> : <AiOutlinePlus />}
        </div>
        <div className="text-xs text-left flex  flex-row items-center">
          <div className="font-bold ">
            {getFormattedDate(event?.primaryDate)}
          </div>
          <div className="ml-2  text-xs">{event?.provider?.display}</div>
        </div>
      </div>

      <div className={` text-xs font-bold  ${claimType.textColor}`}>
        {claimType.title}
      </div>
    </button>
  );
};

const TimelineEventContent = ({ event, claimType }) => {
  const [activeTimelineEvent, setActiveTimelineEvent] = useRecoilState(
    activeTimelineEventState
  );

  const [modal, setModal] = useRecoilState(modalState);
  const [activeListViewEvents, setActiveListViewEvents] = useRecoilState(
    activeListViewEventsState
  );

  const handleGetEmrRecords = () => {
    setActiveTimelineEvent(event);
    setModal((prevModal) => {
      return {
        ...prevModal,
        isRequestingEMR: true,
      };
    });
  };

  const isSelected = activeListViewEvents.includes(event?.uid);
  return (
    <div className={`${isSelected ? "block" : "hidden"} mt-8`}>
      <div className="font-bold text-xs">
        {getFormattedDate(event?.primaryDate)}
      </div>
      <div className=" text-xs">{event?.provider?.display}</div>
      <div className={` text-xs font-bold  ${claimType.textColor}`}>
        {claimType.title}
      </div>
      {/* <div className=" font-bold text-xs mt-1">{event?.provider?.display}</div> */}
      {/* 
      {event?.provider?.npiCode && (
        <div className="py-2 text-xs">NPI code: {event?.provider?.npiCode}</div>
      )} */}
      {event?.diagnosis?.length > 0 && (
        <div className=" mt-8">
          <div className=" font-bold text-xs">Diagnosis</div>
          <div className="space-y-2 mt-2">
            {event?.diagnosis?.map((e, i) => {
              if (e.codeableConcept?.display) {
                return (
                  <DiagnosisInfo
                    key={i}
                    code={e.codeableConcept?.code}
                    display={e.codeableConcept?.display}
                  />
                );
              }
            })}
          </div>
        </div>
      )}
      {event?.procedure?.length > 0 && (
        <div className="mt-8">
          <div className=" font-bold text-xs">Procedures</div>

          <div className="space-y-2 mt-2">
            {event?.procedure?.map((e, i) => {
              let display = e.procedure?.codeDisplay;
              if (!display) display = e.display;
              return <ProcedureInfo key={i} display={display} />;
            })}
          </div>
        </div>
      )}

      {event?.prescription?.display && (
        <div className="mt-8">
          <div className=" font-bold text-xs mb-2">Prescription</div>
          <PrescriptionDisplay display={event?.prescription?.display} />
        </div>
      )}
      {claimType?.title !== "Pharmacy" && (
        <div className="mt-8">
          <button
            onClick={handleGetEmrRecords}
            className="text-xs p-3 px-8 font-bold border rounded-lg bg-black text-white"
          >
            Get EMR records
          </button>
        </div>
      )}
    </div>
  );
};

// https://www.hl7.org/fhir/valueset-claim-type.html
// claim tpyes
const TimelineEvent = ({ event }) => {
  const claimTypeCode = event?.type?.[0]?.code;
  // console.log(claimTypeCode);
  // if (claimTypeCode === "oral" || claimTypeCode === "pharmacy") return null;

  const claimType = claimTypeEvent[claimTypeCode];

  return (
    <div className={`border-b last:border-b-none py-8 w-full`}>
      <TimelineEventHeader claimType={claimType} event={event} />
      <TimelineEventContent claimType={claimType} event={event} />
    </div>
  );
};

const Timeline = ({ timelineData }) => {
  const isLoadingTimeline = useRecoilValue(isLoadingTimelineDataState);

  if (isLoadingTimeline) {
    return <LoadingWindow display="Generating timeline..." />;
  }
  return (
    <div className=" w-full">
      {timelineData.map((e, i) => {
        return <TimelineEvent key={i} event={e} />;
      })}
    </div>
  );
};

const FilterSidebarCheckboxOption = ({
  label,
  color,
  name,
  onSelectFilterInput,
  timelineFilter,
}) => {
  const isSelected = () => {
    if (name === "inpatient" && timelineFilter?.inpatient) return true;
    if (name === "outpatient" && timelineFilter?.outpatient) return true;
    if (name === "medications" && timelineFilter?.medications) return true;
    if (name === "vision" && timelineFilter?.vision) return true;
  };

  const selected = isSelected();

  return (
    <div className="flex flex-row items-center justify-between">
      <label className={`text-sm `}>{label}</label>
      <button
        name={name}
        onClick={onSelectFilterInput}
        className={`w-5 h-5 p-[1px] border-gray-400 border rounded-sm`}
      >
        <div
          className={`h-full w-full ${selected ? "bg-black" : null} rounded-sm`}
        ></div>
      </button>
    </div>
  );
};

const FilterSidebar = ({ timelineFilter, onSelectFilterInput, onReset }) => {
  return (
    <div className="border-gray-200 w-60 border p-4 rounded-lg">
      <div className="font-bold mb-6">Timeline options</div>
      <div className="space-y-2">
        <FilterSidebarCheckboxOption
          timelineFilter={timelineFilter}
          onSelectFilterInput={onSelectFilterInput}
          name={"inpatient"}
          label={"Inpatient"}
        />
        <FilterSidebarCheckboxOption
          timelineFilter={timelineFilter}
          onSelectFilterInput={onSelectFilterInput}
          name={"outpatient"}
          label={"Outpatient"}
        />
        <FilterSidebarCheckboxOption
          timelineFilter={timelineFilter}
          onSelectFilterInput={onSelectFilterInput}
          name={"medications"}
          label={"Medications"}
        />
        <FilterSidebarCheckboxOption
          timelineFilter={timelineFilter}
          onSelectFilterInput={onSelectFilterInput}
          name={"vision"}
          label={"Vision"}
        />
      </div>
      <div>
        <button
          onClick={onReset}
          className="p-3 mt-6 px-6 font-bold border rounded-lg bg-black text-white"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

// const encounterTypes = ["HH", "IMP", "VR", "EMER", "AMB", "OBSENC"];
const idleFilterState = {
  inpatient: true,
  outpatient: true,
  vision: true,
  medications: true,
};

const renderTimelineEvent = (event) => {
  return <TimelineEvent event={event} />;
};
const ListView = () => {
  const getPatientTimelineData = useRecoilCallback(
    getPatientTimelineDataCallback
  );

  const isLoadingTimelineData = useRecoilValue(isLoadingTimelineDataState);
  const timelineData = useRecoilValue(timelineDataState);

  const [timelineFilter, setTimelineFilter] = useState(idleFilterState);

  const [activeTimelineEvent, setActiveTimelineEvent] = useRecoilState(
    activeTimelineEventState
  );

  // should refire the query to BE
  const onSelectFilterInput = (e) => {
    const filterInput = e.currentTarget.name;

    if (filterInput === "inpatient") {
      setTimelineFilter((prevState) => {
        return {
          ...prevState,
          inpatient: !timelineFilter.inpatient,
        };
      });
    } else if (filterInput === "outpatient") {
      setTimelineFilter((prevState) => {
        return {
          ...prevState,
          outpatient: !timelineFilter.outpatient,
        };
      });
    } else if (filterInput === "medications") {
      setTimelineFilter((prevState) => {
        return {
          ...prevState,
          medications: !timelineFilter.medications,
        };
      });
    } else if (filterInput === "vision") {
      setTimelineFilter((prevState) => {
        return {
          ...prevState,
          vision: !timelineFilter.vision,
        };
      });
    }
  };

  const onReset = () => {
    // setTimelineFilter(idleFilterState);
  };

  const timelineContainerRef = useRef();
  const { patientUid } = useParams();

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      setActiveTimelineEvent(null);
    }
  };
  // TODO – add in a filter for inpatient, outpatient, etc
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown, false);
    if (patientUid) {
      getPatientTimelineData(patientUid);
    } else {
      getPatientTimelineData();
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown, false);
    };
  }, []);

  let height = 300;
  if (activeTimelineEvent) {
    height = 150;
  }
  return (
    <div className=" flex flex-col  w-full text-md px-2 md:px-28 ">
      <div className={`flex flex-row   w-full`} ref={timelineContainerRef}>
        <section className="">
          <FilterSidebar
            // onReset={onReset}
            timelineFilter={timelineFilter}
            onSelectFilterInput={onSelectFilterInput}
          />
        </section>
        <section className="ml-4 w-full">
          <Timeline timelineData={timelineData} />
        </section>
      </div>
    </div>
  );
};

export default ListView;
