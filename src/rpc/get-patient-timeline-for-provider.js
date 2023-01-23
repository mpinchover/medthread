import axios from "axios";
import { getAuth } from "firebase/auth";
import { getServerConfig } from "../config/config";

export const getPatientTimelineForProvider = async (patientUid) => {
  const config = getServerConfig();
  const authUser = JSON.parse(localStorage.getItem("med_thread_auth_user"));
  const { idToken } = authUser;

  const res = await axios({
    method: "post",
    url: `${config.baseUrl}/get-patient-timeline-data-for-provider`,
    data: {
      patientUid,
    },
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });

  return res.data?.timeline;
};
