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
      const { userUuid, uuid } = event;
      set(isSendingEMRRequestForEobEventState, true);
      sendRequestForEMRDataForEOBEvent(userUuid, uuid);
    } catch (e) {
      console.log(e);
    } finally {
      set(isSendingEMRRequestForEobEventState, false);
    }
  };
