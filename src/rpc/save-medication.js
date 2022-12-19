import axios from "axios";
import { getAuth } from "firebase/auth";
import { getServerConfig } from "../config/config";

export const saveMedication = async (medication) => {
  const config = getServerConfig();
  const authUser = JSON.parse(localStorage.getItem("med_thread_auth_user"));
  const { idToken } = authUser;

  const res = await axios({
    method: "post",
    url: `${config.baseUrl}/save-medication`,
    data: {
      medication,
    },
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });
  return res?.data?.medication;
};
