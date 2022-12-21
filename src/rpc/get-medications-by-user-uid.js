import axios from "axios";

import { getServerConfig } from "../config/config";

export const getMedicationsByUserUid = async () => {
  const config = getServerConfig();
  const authUser = JSON.parse(localStorage.getItem("med_thread_auth_user"));
  const { idToken } = authUser;

  const res = await axios({
    method: "get",
    url: `${config.baseUrl}/get-medications-by-user-uid`,

    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });

  if (!res.data.medications) return [];
  return res.data.medications;
};
