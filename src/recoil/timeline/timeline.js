import { atom, selector } from "recoil";
import { getPatientTimeline } from "../../rpc/get-patient-timeline";
import { getPatientTimelineForProvider } from "../../rpc/get-patient-timeline-for-provider";

export const timelineDataState = atom({
  key: "timelineDataState",
  default: [],
});

const initialFilterState = {
  inpatient: true,
  outpatient: true,
  vision: true,
};

export const timelineDataFiltersState = atom({
  key: "timelineDataFiltersState",
  default: initialFilterState,
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

export const activeListViewEventsState = atom({
  key: "activeListViewEventsState",
  default: [],
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

const mapToBackendFilter = (params) => {
  const encounterTypes = [];
  if (params?.inpatient) encounterTypes.push("institutional");
  if (params?.outpatient) encounterTypes.push("professional");
  if (params?.vision) encounterTypes.push("vision");

  const filter = {
    encounterTypes,
  };
  return filter;
  /*
    
    // converted on the frontend
    const filter: PatientRecordsQueryFilter = {
      userUid: patientUid,
      encounterTypes
    };
     */
};

// https://terminology.hl7.org/ValueSet-encounter-class.html
export const getPatientTimelineDataCallback =
  ({ set, snapshot }) =>
  async (patientUuid, providerUuid) => {
    try {
      set(isLoadingTimelineDataState, true);

      const filters = {
        inpatient: true,
        outpatient: true,
        vision: true,
      };
      const filter = mapToBackendFilter(filters);
      let timeline;
      if (patientUuid) {
        timeline = await getPatientTimelineForProvider(
          patientUuid,
          filter,
          providerUuid
        );
      } else {
        timeline = await getPatientTimeline(filters);
      }
      if (!timeline) timeline = [];
      set(timelineDataState, timeline);
    } catch (e) {
      console.log(e);
    } finally {
      set(isLoadingTimelineDataState, false);
    }
  };
