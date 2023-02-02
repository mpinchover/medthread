import { Timeline } from "react-svg-timeline";
import {
  activeTimelineEventState,
  setActiveTimelineEventCallback,
} from "../../recoil/timeline/timeline";
import { useRecoilState, useRecoilCallback, useRecoilValue } from "recoil";
import { useEffect, useState } from "react";
// import { claimTypeEvent } from "../common";

const inpatientLaneId = "inpatient-lane";
const inpatientLaneTitle = "Inpatient visists";
const outpatientLaneId = "outpatient-lane";
const outpatientLaneTitle = "Outpatient visists";
const visionLaneId = "vision-lane";
const visisionLaneTitle = "Vision visists";
const medicationsLaneId = "medications-lane";
const medicationsTitle = "Medications";

const laneId = "visit-lane";
const lanes = [
  {
    laneId: "inpatient-lane",
    label: "Inpatient visits",
  },
  {
    laneId: "outpatient-lane",
    label: "Outpatient vists",
  },
  {
    laneId: "vision-lane",
    label: "Vision vists",
  },
  {
    laneId: "medications-lane",
    label: "Medications",
  },
  // {
  //   laneId: "diagnoses-lane",
  //   label: "Diagnoses",
  // },
];

const claimTypeEvent = {
  institutional: {
    title: "Inpatient",
    laneId: inpatientLaneId,
    // textColor: "text-red-600",
  },
  oral: {
    title: "Dentist",

    // textColor: "text-blue-600",
  },
  pharmacy: {
    title: "Medications",
    laneId: medicationsLaneId,
    // textColor: "text-blue-600",
  },
  professional: {
    title: "Outpatient",
    laneId: outpatientLaneId,
    // textColor: "text-blue-600",
  },
  vision: {
    title: "Vision",
    laneId: visionLaneId,
    // textColor: "text-blue-600",
  },
};

const InteractiveTimeline = ({ width, timelineData, height }) => {
  const activeTimelineEvent = useRecoilValue(activeTimelineEventState);
  const setActiveTimelineEvent = useRecoilCallback(
    setActiveTimelineEventCallback
  );

  const [events, setEvents] = useState([]);

  const timeSet = new Set();

  useEffect(() => {
    const timelineEvents = [];
    timelineData?.map((e, i) => {
      const code = e?.types?.[0];

      let startISO = e?.billablePeriodStart;

      if (code === "pharmacy") {
        startISO = e?.primaryDate;
      }

      let startTimeMs;
      let endTimeMs;
      // if they are the same times, add one minute to it
      if (startISO) {
        const startDate = new Date(startISO);
        startTimeMs = startDate.getTime();

        while (timeSet.has(startTimeMs)) {
          startDate.setHours(startDate.getHours() + 6);
          startTimeMs = startDate.getTime();
        }
        timeSet.add(startTimeMs);
      }

      const codeTitle = claimTypeEvent[code]?.title;
      const eventLaneId = claimTypeEvent[code]?.laneId;
      const timelineData = {
        eventId: e?.fhirReference,
        tooltip: codeTitle,
        // diagnosis: e?.diagnosis,
        // procedure: e?.procedure,
        // prescription: e?.prescription,
        // provider: e?.provider,
        // type: codeTitle,
        laneId: eventLaneId,
        startTimeMillis: startTimeMs,
      };

      //   const timelineData = {
      //     eventId: "event-1" + i,
      //     tooltip: "Event 1",
      //     laneId: inpatientLaneId,
      //     // 1468281600000
      //     // 1468368000000
      //     // 1314782800000
      //     startTimeMillis: startTimeMs,
      //     // endTimeMillis: 1514783800000,
      //   };
      //   console.log("TIMELINE DATA IS ");
      //   console.log(timelineData);

      if (code !== "oral") {
        timelineEvents.push(timelineData);
      }
    });
    setEvents(timelineEvents);
  }, [timelineData]);

  //   const events = [
  //     {
  //       eventId: "event-1",
  //       tooltip: "Event 1",
  //       laneId: "visit-lane",
  //       startTimeMillis: 1167606000000,
  //       endTimeMillis: 1230698892000,
  //     },
  //     {
  //       eventId: "event-2",
  //       tooltip: "Event 2",
  //       laneId: "visit-lane",
  //       startTimeMillis: 1239698892000,
  //       endTimeMillis: 1269698892000,
  //     },
  //     {
  //       eventId: "event-3",
  //       tooltip: "Event 3",
  //       laneId: "visit-lane",
  //       startTimeMillis: 1167606000000,
  //     },
  //   ];

  // just getting back event ID so need to create a mapping
  // maybe event id should be the fhir reference
  const handleEventClick = (eventId) => {
    setActiveTimelineEvent(eventId);
  };

  const dateFormat = (ms) => new Date(ms).toLocaleString();

  const handleZoomChange = (startMs, endMs) => {};

  const today = Date.now();

  var d = new Date(today);
  d.setFullYear(d.getFullYear() - 1);

  return (
    <div>
      <Timeline
        width={width}
        height={height}
        events={events}
        lanes={lanes}
        dateFormat={dateFormat}
        onEventClick={handleEventClick}
        onZoomRangeChange={handleZoomChange}
        customRange={[d.getTime(), today]} // TODO - get the last, first dates of events
      />
    </div>
  );
};

export default InteractiveTimeline;
