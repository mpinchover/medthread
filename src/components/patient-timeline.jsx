import { useRecoilValue, useRecoilCallback } from "recoil";
import { useEffect } from "react";
import {
  getPatientTimelineDataCallback,
  isLoadingTimelineDataState,
  timelineDataState,
} from "../recoil/timeline/timeline";

const TimelineEvent = () => {
  return (
    <div className="relative bg-blue-400 p-4 rounded-md text-white w-full">
      <div>Jan 5th 2023</div>
      <div>Some event</div>
    </div>
  );
};

const Timeline = ({ timelineData }) => {
  return (
    <div className="space-y-6 w-full">
      <TimelineEvent />
      <TimelineEvent />
      <TimelineEvent />
    </div>
  );
};

const FilterSidebarCheckboxOption = () => {
  return (
    <div className="flex flex-row items-center justify-between">
      <label>Ambulatory</label>
      <button className="w-5 h-5 p-1 border-black border rounded-sm">
        <div className="h-full w-full bg-black rounded-sm"></div>
      </button>
    </div>
  );
};

const FilterSidebar = () => {
  return (
    <div className="w-60 border p-4">
      <div>Timeline options</div>
      <div className="space-y-6">
        <FilterSidebarCheckboxOption />
        <FilterSidebarCheckboxOption />
        <FilterSidebarCheckboxOption />
        <FilterSidebarCheckboxOption />
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
