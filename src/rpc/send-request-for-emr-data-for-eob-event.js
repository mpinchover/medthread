import axios from "axios";
import { getServerConfig } from "../config/config";

export const sendRequestForEMRDataForEOBEvent = async (
  patientUuid,
  eobUuid
) => {
  const authUser = JSON.parse(localStorage.getItem("med_thread_auth_user"));
  const { idToken, userUuid } = authUser;
  const config = getServerConfig();

  // validation – coudl not get the uid
  const res = await axios({
    method: "post",
    url: `${config.baseUrl}/send-request-for-emr-data-for-eob-event`,
    data: {
      patientUuid,
      eobUuid,
      userUuid,
    },

    headers: {
      "Access-Control-Allow-Origin": "*",
      Authorization: `Bearer ${idToken}`,
    },
  });
};
