import axios from "axios";
import { getServerConfig } from "../config/config";

export const addHealthInsuranceProvider = async (publicToken) => {
  const config = getServerConfig();
  const authUser = JSON.parse(localStorage.getItem("med_thread_auth_user"));
  const { idToken } = authUser;

  const res = await axios({
    method: "post",
    url: `${config.baseUrl}/add-health-insurance-provider`,
    data: {
      publicToken,
    },
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });
  const { newProvider, medications } = res.data;

  return {
    newProvider,
    medications,
  };
  // should we get the medications from this provider?
};
// needs server side for pulling meds, getting capabilites, etc
