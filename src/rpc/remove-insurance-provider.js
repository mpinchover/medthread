import axios from "axios";
import { getServerConfig } from "../config/config";

export const removeHealthInsuranceProvider = async (insuranceProviderUid) => {
  const config = getServerConfig();
  const authUser = JSON.parse(localStorage.getItem("med_thread_auth_user"));
  const { idToken } = authUser;

  const res = await axios({
    method: "post",
    url: `${config.baseUrl}/remove-health-insurance-provider`,
    data: {
      insuranceProviderUid,
    },
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });
};
