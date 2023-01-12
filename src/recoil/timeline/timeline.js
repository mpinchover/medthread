import { atom, selector } from "recoil";
import { getPatientTimeline } from "../../rpc/get-patient-timeline";

const fakeTimelineData = [
  {
    code: "IMP",
    start: "2021-01-10",
    status: "in-progress",
    type: "ENCOUNTER",
    primaryDate: "2021-01-10",
  },
  {
    code: "IMP",
    start: "2021-01-09",
    status: "in-progress",
    type: "ENCOUNTER",
    primaryDate: "2021-01-09",
  },
  {
    codeDisplay: "Removal of Spacer from Right Knee Joint, Open Approach",
    primaryDate: "2021-01-08",
    status: "unknown",
    type: "PROCEDURE",
  },
  {
    codeDisplay: "Removal of Spacer from Right Knee Joint, Open Approach",
    primaryDate: "2021-01-07",
    status: "completed",
    type: "PROCEDURE",
  },
  {
    code: "AMB",
    start: "2020-05-09",
    status: "completed",
    type: "ENCOUNTER",
    primaryDate: "2020-05-09",
  },
  {
    codeDisplay: "Removal of Spacer from Right Knee Joint, Open Approach",
    primaryDate: "2020-05-06",
    status: "unknown",
    type: "PROCEDURE",
  },
  {
    code: "EMER",
    start: "2020-04-01",
    status: "completed",
    type: "ENCOUNTER",
    primaryDate: "2020-04-01",
  },
  {
    code: "EMER",
    start: "2020-02-01",
    status: "completed",
    type: "ENCOUNTER",
    primaryDate: "2020-02-01",
  },
  {
    code: "IMP",
    start: "2020-01-01",
    status: "completed",
    type: "ENCOUNTER",
    primaryDate: "2020-01-01",
  },
];
export const timelineDataState = atom({
  key: "timelineDataState",
  default: fakeTimelineData,
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
  default: initialFilterState,
});

export const filteredTimelineDataState = atom({
  key: "filteredTimelineDataState",
  default: {},
});

export const isLoadingTimelineDataState = atom({
  key: "isLoadingTimelineDataState",
  default: false,
});

// https://terminology.hl7.org/ValueSet-encounter-class.html
export const getPatientTimelineDataCallback =
  ({ set, snapshot }) =>
  async (timelineFilter) => {
    const filter = {
      encounter: timelineFilter.encounterTypes.length > 0,
      encounterTypes: timelineFilter.encounterTypes,
      procedure: timelineFilter.procedure,
    };

    // convert timeline filters to rpc filter
    try {
      set(isLoadingTimelineDataState, true);
      let timeline = await getPatientTimeline(filter);
      if (!timeline) timeline = {};
      set(timelineDataState, timeline);
    } catch (e) {
      console.log(e);
    } finally {
      set(isLoadingTimelineDataState, false);
    }
  };
