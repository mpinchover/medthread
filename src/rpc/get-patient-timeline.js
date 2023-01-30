import axios from "axios";
import { getAuth } from "firebase/auth";
import { getServerConfig } from "../config/config";

export const getPatientTimeline = async (filter) => {
  const config = getServerConfig();
  const authUser = JSON.parse(localStorage.getItem("med_thread_auth_user"));

  const { idToken, userUuid } = authUser;

  filter.userUuid = authUser.uid;

  const res = await axios({
    method: "post",
    url: `${config.baseUrl}/get-patient-timeline-data`,
    data: {
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
