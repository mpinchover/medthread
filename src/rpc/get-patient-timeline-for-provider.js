import axios from "axios";
import { getAuth } from "firebase/auth";
import { getServerConfig } from "../config/config";

export const getPatientTimelineForProvider = async (
  idToken,
  patientUuid,
  filter,
  providerUuid
) => {
  const config = getServerConfig();

  filter.userUuid = patientUuid;
  const res = await axios({
    method: "post",
    url: `${config.baseUrl}/get-patient-timeline-data-for-provider`,
    data: {
      patientUuid,
      filter,
      providerUuid,
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
      Authorization: `Bearer ${idToken}`,
    },
  });

  return res.data?.timeline;
};
