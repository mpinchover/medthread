import axios from "axios";
import { getServerConfig } from "../config/config";

export const sendRequestForEMRDataForEOBEvent = async (
  idToken,
  patientUid,
  eobUid
) => {
  const config = getServerConfig();

  // validation – coudl not get the uid
  const res = await axios({
    method: "post",
    url: `${config.baseUrl}/send-request-for-emr-data-for-eob-event`,
    data: {
      patientUid,
      eobUid,
    },

    headers: {
      "Access-Control-Allow-Origin": "*",
      Authorization: `Bearer ${idToken}`,
    },
  });
};
