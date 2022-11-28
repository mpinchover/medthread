import axios from "axios";
import { getServerConfig } from "../config/config";

export const getMedicationsForProvider = async (patientUid) => {
  const authUser = JSON.parse(localStorage.getItem("med_thread_auth_user"));
  const { idToken } = authUser;
  const config = getServerConfig();

  const res = await axios({
    method: "post",
    url: `${config.baseUrl}/get-medications-for-provider`,
    data: {
      patientUid,
    },
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });

  if (!res.data.medications) return [];
  return res.data.medications;
};
