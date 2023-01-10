import { atom, selector } from "recoil";
import { getPatientTimelineData } from "../../rpc/get-patient-timeline-data";

export const timelineDataState = atom({
  key: "timelineDataState",
  default: {},
});

export const filteredTimelineDataState = atom({
  key: "filteredTimelineDataState",
  default: {},
});

export const isLoadingTimelineDataState = atom({
  key: "isLoadingTimelineDataState",
  default: false,
});

export const getPatientTimelineDataCallback =
  ({ set, snapshot }) =>
  async () => {
    try {
      set(isLoadingTimelineDataState, true);
      let timeline = await getPatientTimelineData();
      if (!timeline) timeline = {};
      set(timelineDataState, timeline);
    } catch (e) {
      console.log(e);
    } finally {
      set(isLoadingTimelineDataState, false);
    }
  };
