import { useRecoilValue, useRecoilCallback } from "recoil";
import { useEffect, useState, useRef } from "react";
import { FaPen, FaPlus, FaMinusCircle } from "react-icons/fa";
import {
  getPatientTimelineDataCallback,
  isLoadingTimelineDataState,
  timelineDataState,
} from "../recoil/timeline/timeline";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { getFormattedDate } from "./utils";
import { activeTimelineEventState } from "../recoil/timeline/timeline";
import { useRecoilState } from "recoil";
import { useParams } from "react-router-dom";
import { modalState } from "../recoil/utils/utils";
// import { Timeline } from 'react-svg-timeline'
import InteractiveTimeline from "./timeline/interactive-timeline";
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

// const TimelineEventHeader = ({ event, claimType }) => {
//   const [activeTimelineEvent, setActiveTimelineEvent] = useRecoilState(
//     activeTimelineEventState
//   );

//   const isSelected = activeTimelineEvent.uid === event.uid;

//   const handleClick = () => {
//     setActiveTimelineEvent((prevState) => {
//       if (prevState.includes(event.uid)) {
//         const newActiveElements = prevState.filter((x) => x !== event.uid);
//         return newActiveElements;
//       } else {
//         return [...prevState, event.uid];
//       }
//     });
//   };
//   return (
//     <button
//       onClick={handleClick}
//       className={`w-full relative  flex flex-row justify-between`}
//     >
//       <div className=" items-center flex flex-row">
//         <div className="font-thin mr-2 ">
//           {isSelected ? <AiOutlineMinus /> : <AiOutlinePlus />}
//         </div>
//         <div className="text-xs text-left flex  flex-row items-center">
//           <div className="font-bold ">
//             {getFormattedDate(event?.primaryDate)}
//           </div>
//           <div className="ml-2  text-xs">{event?.provider?.display}</div>
//         </div>
//       </div>

//       <div className={` text-xs font-bold  ${claimType.textColor}`}>
//         {claimType.title}
//       </div>
//     </button>
//   );
// };

const TimelineEventContent = ({ event, claimType }) => {
  const [activeTimelineEvent, setActiveTimelineEvent] = useRecoilState(
    activeTimelineEventState
  );

  const [modal, setModal] = useRecoilState(modalState);

  const handleGetEmrRecords = () => {
    setActiveTimelineEvent(event);
    setModal((prevModal) => {
      return {
        ...prevModal,
        isRequestingEMR: true,
      };
    });
  };

  const isSelected = activeTimelineEvent.uid === event.uid;
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
              console.log("E");
              console.log(e);
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
      <div className="mt-8">
        <button
          onClick={handleGetEmrRecords}
          // onClick={handleSubmit}
          className="text-xs p-3 px-8 font-bold border rounded-lg bg-black text-white"
        >
          Get EMR records
        </button>
      </div>
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
    <div className={` py-8 w-full`}>
      {/* <TimelineEventHeader claimType={claimType} event={event} /> */}
      <TimelineEventContent claimType={claimType} event={event} />
    </div>
  );
};

// const Timeline = ({ timelineData }) => {
//   const isLoadingTimeline = useRecoilValue(isLoadingTimelineDataState);

//   if (isLoadingTimeline) {
//     return (
//       <div className=" w-full relative">
//         <div className="absolute top-1/2 right-1/2 -translate-y-1/2">
//           Generating timeline...
//         </div>
//       </div>
//     );
//   }
//   return (
//     <div className=" w-full">
//       {timelineData.map((e, i) => {
//         return <TimelineEvent key={i} event={e} />;
//       })}
//     </div>
//   );
// };

// const FilterSidebarCheckboxOption = ({
//   label,
//   color,
//   name,
//   onSelectFilterInput,
//   timelineFilter,
// }) => {
//   const isSelected = () => {
//     return (
//       (name === "PROCEDURE" && timelineFilter?.procedure) ||
//       timelineFilter?.encounterTypes?.includes(name)
//     );
//   };

//   const selected = isSelected();
//   return (
//     <div className="flex flex-row items-center justify-between">
//       <label className={`text-sm `}>{label}</label>
//       <button
//         name={name}
//         onClick={onSelectFilterInput}
//         className={`w-5 h-5 p-[1px] border-gray-400 border rounded-sm`}
//       >
//         <div
//           className={`h-full w-full ${selected ? "bg-black" : null} rounded-sm`}
//         ></div>
//       </button>
//     </div>
//   );
// };

// const FilterSidebar = ({ timelineFilter, onSelectFilterInput, onReset }) => {
//   return (
//     <div className="w-60 border p-4">
//       <div className="font-bold mb-6">Timeline options</div>
//       <div className="space-y-6">
//         <FilterSidebarCheckboxOption
//           timelineFilter={timelineFilter}
//           onSelectFilterInput={onSelectFilterInput}
//           name={"IMP"}
//           label={"Inpatient"}
//         />
//         <FilterSidebarCheckboxOption
//           timelineFilter={timelineFilter}
//           onSelectFilterInput={onSelectFilterInput}
//           name={"AMB"}
//           label={"Ambulatory"}
//         />
//         <FilterSidebarCheckboxOption
//           timelineFilter={timelineFilter}
//           onSelectFilterInput={onSelectFilterInput}
//           name={"OBSENC"}
//           label={"Observation"}
//         />
//         <FilterSidebarCheckboxOption
//           timelineFilter={timelineFilter}
//           onSelectFilterInput={onSelectFilterInput}
//           name={"EMER"}
//           label={"Emergency"}
//         />
//         <FilterSidebarCheckboxOption
//           timelineFilter={timelineFilter}
//           onSelectFilterInput={onSelectFilterInput}
//           name={"VR"}
//           label={"Virtual"}
//         />
//         <FilterSidebarCheckboxOption
//           timelineFilter={timelineFilter}
//           onSelectFilterInput={onSelectFilterInput}
//           name={"HH"}
//           label={"Home visit"}
//         />
//         <FilterSidebarCheckboxOption
//           timelineFilter={timelineFilter}
//           onSelectFilterInput={onSelectFilterInput}
//           name={"PROCEDURE"}
//           label={"Procedure"}
//         />
//         <button
//           onClick={onReset}
//           className="p-3 px-6 font-bold border rounded-lg bg-black text-white"
//         >
//           Reset
//         </button>
//       </div>
//     </div>
//   );
// };

// const encounterTypes = ["HH", "IMP", "VR", "EMER", "AMB", "OBSENC"];
// const idleFilterState = {
//   encounter: true,
//   encounterTypes: encounterTypes,
//   procedure: true,
// };

const renderTimelineEvent = (event) => {
  return <TimelineEvent event={event} />;
};
const PatientTimeline = () => {
  const getPatientTimelineData = useRecoilCallback(
    getPatientTimelineDataCallback
  );

  const isLoadingTimelineData = useRecoilValue(isLoadingTimelineDataState);
  const timelineData = useRecoilValue(timelineDataState);

  // const [timelineFilter, setTimelineFilter] = useState(idleFilterState);

  const [activeTimelineEvent, setActiveTimelineEvent] = useRecoilState(
    activeTimelineEventState
  );

  // should refire the query to BE
  // const onSelectFilterInput = (e) => {
  //   const filterInput = e.currentTarget.name;

  //   if (filterInput === "PROCEDURE") {
  //     setTimelineFilter((prevState) => {
  //       return {
  //         ...prevState,
  //         procedure: !timelineFilter.procedure,
  //       };
  //     });
  //   }

  //   if (isEncounterType(filterInput)) {
  //     if (timelineFilter.encounterTypes?.includes(filterInput)) {
  //       const newEncounterTypes = timelineFilter.encounterTypes.filter(
  //         (x) => x !== filterInput
  //       );

  //       setTimelineFilter((prevState) => {
  //         return {
  //           ...prevState,
  //           encounterTypes: newEncounterTypes,
  //         };
  //       });
  //     } else {
  //       setTimelineFilter((prevState) => {
  //         return {
  //           ...prevState,
  //           encounterTypes: [...prevState.encounterTypes, filterInput],
  //         };
  //       });
  //     }
  //   }
  // };

  // const isEncounterType = (filterInput) => {
  //   return encounterTypes.includes(filterInput);
  // };

  // const onReset = () => {
  //   setTimelineFilter(idleFilterState);
  // };

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

  let height = 400;
  if (activeTimelineEvent) {
    height = 150;
  }
  return (
    <div className=" flex flex-col  w-full text-md px-2 md:px-28 ">
      <div className={`flex flex-col   w-full`} ref={timelineContainerRef}>
        {/* <section className="mr-4">
        <FilterSidebar
          onReset={onReset}
          timelineFilter={timelineFilter}
          onSelectFilterInput={onSelectFilterInput}
        />
      </section> */}
        {/* <Timeline timelineData={timelineData} /> */}

        <InteractiveTimeline
          width={timelineContainerRef?.current?.offsetWidth}
          height={height}
          timelineData={timelineData}
        />
      </div>
      <div>
        {activeTimelineEvent && renderTimelineEvent(activeTimelineEvent)}
      </div>
    </div>
  );
};

export default PatientTimeline;
