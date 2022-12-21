import axios from "axios";
import { getServerConfig } from "../config/config";

export const sendMedicationsToProvider = async (healthcareProviderEmail) => {
  const authUser = JSON.parse(localStorage.getItem("med_thread_auth_user"));
  const { idToken } = authUser;
  const config = getServerConfig();

  // validation – coudl not get the uid
  const res = await axios({
    method: "post",
    url: `${config.baseUrl}/send-medications-to-provider`,
    data: {
      healthcareProviderEmail,
    },
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });
  return res.data.healthcareProvider;
};
