import { useRecoilValue, useRecoilCallback } from "recoil";
import { useEffect, useState } from "react";
import {
  getPatientTimelineDataCallback,
  isLoadingTimelineDataState,
  timelineDataState,
} from "../recoil/timeline/timeline";

const TimelineEvent = (e) => {
  console.log("EVENT IS");
  console.log(e);
  return (
    <div className={`relative  p-4 rounded-md border w-full`}>
      <div className="font-bold">{e?.event?.primaryDate}</div>
      <div className=" font-bold text-xs mt-1">{e?.event?.type}</div>
      {e?.event?.status && (
        <div className=" font-bold text-xs mt-1">Status {e?.event?.status}</div>
      )}
      {(e?.event?.start || e?.event?.end) && (
        <div className="flex flex-row font-bold text-xs mt-1 space-x-2">
          <div className="">Period</div>
          <div>{e?.event?.start ? e?.event?.start : "UNKNOWN"}</div>
          <div>–</div>
          <div>{e?.event?.end ? e?.event?.end : "UNKNOWN"}</div>
        </div>
      )}
      {e?.event?.codeDisplay && (
        <div className="mt-4">{e?.event?.codeDisplay}</div>
      )}
    </div>
  );
};

const Timeline = ({ timelineData }) => {
  return (
    <div className="space-y-6 w-full">
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
    return (
      (name === "PROCEDURE" && timelineFilter?.procedure) ||
      timelineFilter?.encounterTypes?.includes(name)
    );
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

const FilterSidebar = ({
  timelineFilter,
  onSelectFilterInput,
  handleReset,
}) => {
  return (
    <div className="w-60 border p-4">
      <div className="font-bold mb-6">Timeline options</div>
      <div className="space-y-6">
        <FilterSidebarCheckboxOption
          timelineFilter={timelineFilter}
          onSelectFilterInput={onSelectFilterInput}
          name={"IMP"}
          label={"Inpatient"}
        />
        <FilterSidebarCheckboxOption
          timelineFilter={timelineFilter}
          onSelectFilterInput={onSelectFilterInput}
          name={"AMB"}
          label={"Ambulatory"}
        />
        <FilterSidebarCheckboxOption
          timelineFilter={timelineFilter}
          onSelectFilterInput={onSelectFilterInput}
          name={"OBSENC"}
          label={"Observation"}
        />
        <FilterSidebarCheckboxOption
          timelineFilter={timelineFilter}
          onSelectFilterInput={onSelectFilterInput}
          name={"EMER"}
          label={"Emergency"}
        />
        <FilterSidebarCheckboxOption
          timelineFilter={timelineFilter}
          onSelectFilterInput={onSelectFilterInput}
          name={"VR"}
          label={"Virtual"}
        />
        <FilterSidebarCheckboxOption
          timelineFilter={timelineFilter}
          onSelectFilterInput={onSelectFilterInput}
          name={"HH"}
          label={"Home visit"}
        />
        <FilterSidebarCheckboxOption
          timelineFilter={timelineFilter}
          onSelectFilterInput={onSelectFilterInput}
          name={"PROCEDURE"}
          label={"Procedure"}
        />
        <button
          onClick={handleReset}
          className="p-3 px-6 font-bold border rounded-lg bg-black text-white"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

// export interface TimelineEvent {
//   primaryDate?: string;
//   event?: any;
//   type?: string;
// }

const encounterTypes = ["HH", "IMP", "VR", "EMER", "AMB", "OBSENC"];
const idleFilterState = {
  encounter: true,
  encounterTypes: encounterTypes,
  procedure: true,
};

const PatientTimeline = () => {
  const getPatientTimelineData = useRecoilCallback(
    getPatientTimelineDataCallback
  );

  const isLoadingTimelineData = useRecoilValue(isLoadingTimelineDataState);
  const timelineData = useRecoilValue(timelineDataState);

  const [timelineFilter, setTimelineFilter] = useState(idleFilterState);

  const onSelectFilterInput = (e) => {
    const filterInput = e.currentTarget.name;

    if (filterInput === "PROCEDURE") {
      setTimelineFilter((prevState) => {
        return {
          ...prevState,
          procedure: !timelineFilter.procedure,
        };
      });
    }

    if (isEncounterType(filterInput)) {
      if (timelineFilter.encounterTypes?.includes(filterInput)) {
        const newEncounterTypes = timelineFilter.encounterTypes.filter(
          (x) => x !== filterInput
        );
        console.log("GETTING HERE");
        console.log("NEW ENCOUNTER TPYES");
        console.log(newEncounterTypes);
        setTimelineFilter((prevState) => {
          return {
            ...prevState,
            encounterTypes: newEncounterTypes,
          };
        });
      } else {
        setTimelineFilter((prevState) => {
          return {
            ...prevState,
            encounterTypes: [...prevState.encounterTypes, filterInput],
          };
        });
      }
    }
  };

  const isEncounterType = (filterInput) => {
    return encounterTypes.includes(filterInput);
  };

  useEffect(() => {
    getPatientTimelineData(timelineFilter);
  }, []);

  return (
    <div className=" flex flex-row py-4  w-full text-md px-28 ">
      <section className="mr-4">
        <FilterSidebar
          timelineFilter={timelineFilter}
          onSelectFilterInput={onSelectFilterInput}
        />
      </section>
      <Timeline timelineData={timelineData} />
    </div>
  );
};

export default PatientTimeline;
