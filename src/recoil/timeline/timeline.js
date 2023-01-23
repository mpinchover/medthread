import { atom, selector } from "recoil";
import { getPatientTimeline } from "../../rpc/get-patient-timeline";
import { getPatientTimelineForProvider } from "../../rpc/get-patient-timeline-for-provider";
// const fakeTimelineData = [
//   {
//     code: "IMP",
//     start: "2021-01-10",
//     status: "in-progress",
//     type: "ENCOUNTER",
//     primaryDate: "2021-01-10",
//   },
//   {
//     code: "IMP",
//     start: "2021-01-09",
//     status: "in-progress",
//     type: "ENCOUNTER",
//     primaryDate: "2021-01-09",
//   },
//   {
//     codeDisplay: "Removal of Spacer from Right Knee Joint, Open Approach",
//     primaryDate: "2021-01-08",
//     status: "unknown",
//     type: "PROCEDURE",
//   },
//   {
//     codeDisplay: "Removal of Spacer from Right Knee Joint, Open Approach",
//     primaryDate: "2021-01-07",
//     status: "completed",
//     type: "PROCEDURE",
//   },
//   {
//     code: "AMB",
//     start: "2020-05-09",
//     status: "completed",
//     type: "ENCOUNTER",
//     primaryDate: "2020-05-09",
//   },
//   {
//     codeDisplay: "Removal of Spacer from Right Knee Joint, Open Approach",
//     primaryDate: "2020-05-06",
//     status: "unknown",
//     type: "PROCEDURE",
//   },
//   {
//     code: "EMER",
//     start: "2020-04-01",
//     status: "completed",
//     type: "ENCOUNTER",
//     primaryDate: "2020-04-01",
//   },
//   {
//     code: "EMER",
//     start: "2020-02-01",
//     status: "completed",
//     type: "ENCOUNTER",
//     primaryDate: "2020-02-01",
//   },
//   {
//     code: "IMP",
//     start: "2020-01-01",
//     status: "completed",
//     type: "ENCOUNTER",
//     primaryDate: "2020-01-01",
//   },
// ];
export const timelineDataState = atom({
  key: "timelineDataState",
  default: [],
});

const initialFilterState = {
  AMB: true,
  OBSENC: true,
  EMERG: true,
  VR: true,
  HH: true,
  PROCEDURE: true,
};

export const timelineDataFiltersState = atom({
  key: "timelineDataFiltersState",
  default: {},
});

export const filteredTimelineDataState = atom({
  key: "filteredTimelineDataState",
  default: [],
});

export const isLoadingTimelineDataState = atom({
  key: "isLoadingTimelineDataState",
  default: false,
});

export const activeTimelineEventState = atom({
  key: "activeTimelineEventState",
  default: null,
});

export const setActiveTimelineEventCallback =
  ({ set, snapshot }) =>
  async (timelineEventFhirReference) => {
    try {
      // go through the timeline data state
      const timelineEvents = snapshot.getLoadable(timelineDataState).contents;
      if (!timelineEvents || timelineEvents.length === 0) {
        return [];
      }

      // once you have it, set that the active thing
      for (let i = 0; i < timelineEvents.length; i++) {
        const event = timelineEvents[i];
        if (event.fhirReference === timelineEventFhirReference) {
          set(activeTimelineEventState, event);
          break;
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

// https://terminology.hl7.org/ValueSet-encounter-class.html
export const getPatientTimelineDataCallback =
  ({ set, snapshot }) =>
  async (patientUid) => {
    // const filter = {
    //   encounter: timelineFilter.encounterTypes.length > 0,
    //   encounterTypes: timelineFilter.encounterTypes,
    //   procedure: timelineFilter.procedure,
    // };

    // convert timeline filters to rpc filter
    try {
      set(isLoadingTimelineDataState, true);

      let timeline;
      if (patientUid) {
        timeline = await getPatientTimelineForProvider(patientUid);
      } else {
        timeline = await getPatientTimeline();
      }
      if (!timeline) timeline = [];
      set(timelineDataState, timeline);
    } catch (e) {
      console.log(e);
    } finally {
      set(isLoadingTimelineDataState, false);
    }
  };
