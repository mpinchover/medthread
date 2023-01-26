import { atom } from "recoil";
import { sendRequestForEMRDataForEOBEvent } from "../../rpc/send-request-for-emr-data-for-eob-event";

const isSendingEMRRequestForEobEventState = atom({
  key: "isSendingEMRRequestForEobEventState",
  default: false,
});

export const activeEMRPatientUidState = atom({
  key: "activeEMRPatientState",
  default: null,
});

export const activeEMREobUidState = atom({
  key: "activeEMREobUidState",
  default: null,
});

export const sendEMRRequestForEobEventCallback =
  ({ set, snapshot }) =>
  (event) => {
    try {
      console.log("EVENT IS");
      console.log(event);
      const { userUid, uid } = event;
      set(isSendingEMRRequestForEobEventState, true);
      sendRequestForEMRDataForEOBEvent(userUid, uid);
    } catch (e) {
      console.log(e);
    } finally {
      set(isSendingEMRRequestForEobEventState, false);
    }
  };
