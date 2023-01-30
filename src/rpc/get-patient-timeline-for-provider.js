import axios from "axios";
import { getAuth } from "firebase/auth";
import { getServerConfig } from "../config/config";

export const getPatientTimelineForProvider = async (patientUuid, filter) => {
  const config = getServerConfig();
  const authUser = JSON.parse(localStorage.getItem("med_thread_auth_user"));
  const { idToken, userUuid } = authUser;

  filter.userUuid = patientUuid;
  const res = await axios({
    method: "post",
    url: `${config.baseUrl}/get-patient-timeline-data-for-provider`,
    data: {
      patientUuid,
      filter,
      userUuid,
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
      Authorization: `Bearer ${idToken}`,
    },
  });

  return res.data?.timeline;
};
