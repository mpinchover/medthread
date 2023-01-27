import axios from "axios";
import { getServerConfig } from "../config/config";

// patient is making this call
export const getMedicationsForPatient = async () => {
  const authUser = JSON.parse(localStorage.getItem("med_thread_auth_user"));
  const { idToken, uid } = authUser;
  const config = getServerConfig();
  const res = await axios({
    method: "get",
    url: `${config.baseUrl}/get-medications-by-patient-uid`,
    headers: {
      "Access-Control-Allow-Origin": "*",
      Authorization: `Bearer ${idToken}`,
    },
  });

  const { data } = res;
  if (!data.medications) return [];
  return data.medications;
};
