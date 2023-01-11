import { useRecoilValue, useRecoilCallback } from "recoil";
import { useEffect } from "react";
import {
  getPatientTimelineDataCallback,
  isLoadingTimelineDataState,
  timelineDataState,
} from "../recoil/timeline/timeline";

const colorMap = {
  PROCEDURE: {
    bg: "bg-red-700",
    text: "text-red-700",
    border: "border-red-600",
  },
  ENCOUNTER: {
    bg: "bg-blue-400",
    text: "text-blue-700",
    border: "border-blue-400",
  },
};

const TimelineEvent = (e) => {
  const color = colorMap[e?.event?.type];

  console.log(e.event);
  return (
    <div className={`relative ${color?.bg} p-4 rounded-md text-white w-full`}>
      <div className="font-bold">Jan 5th 2023</div>
      <div>Some event</div>
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

const FilterSidebarCheckboxOption = ({ label, color }) => {
  const coloring = colorMap[color];

  return (
    <div className="flex flex-row items-center justify-between">
      <label className={`text-sm `}>{label}</label>
      <button className={`w-5 h-5 p-[1px] border-gray-400 border rounded-sm`}>
        <div className={`h-full w-full  rounded-sm`}></div>
      </button>
    </div>
  );
};

const FilterSidebar = () => {
  return (
    <div className="w-60 border p-4">
      <div className="font-bold mb-6">Timeline options</div>
      <div className="space-y-6">
        <FilterSidebarCheckboxOption label={"Inpatient"} />
        <FilterSidebarCheckboxOption label={"Ambulatory"} />
        <FilterSidebarCheckboxOption label={"Observation"} />
        <FilterSidebarCheckboxOption label={"Emergency"} />
        <FilterSidebarCheckboxOption label={"Virtual"} />
        <FilterSidebarCheckboxOption label={"Home visit"} />
      </div>
    </div>
  );
};

const PatientTimeline = () => {
  const getPatientTimelineData = useRecoilCallback(
    getPatientTimelineDataCallback
  );

  const isLoadingTimelineData = useRecoilValue(isLoadingTimelineDataState);
  const timelineData = useRecoilValue(timelineDataState);

  useEffect(() => {
    getPatientTimelineData();
  }, []);

  console.log("TIMELINE DATA");
  console.log(timelineData);

  return (
    <div className=" flex flex-row py-4  w-full text-md px-28 ">
      <section className="mr-4">
        <FilterSidebar />
      </section>
      <Timeline timelineData={timelineData} />
    </div>
  );
};

export default PatientTimeline;
