import axios from "axios";
import { getAuth } from "firebase/auth";
import { getServerConfig } from "../config/config";
export const addAuthorizedHealthcareProviderdicationsByUid = async (
  healthcareProviderEmail,
  healthcareProviderName
) => {
  const config = getServerConfig();
  const authUser = JSON.parse(localStorage.getItem("med_thread_auth_user"));
  const { idToken, userUuid } = authUser;

  const res = await axios({
    method: "post",
    url: `${config.baseUrl}/add-authorized-healthcare-provider`,
    data: {
      healthcareProviderEmail,
      healthcareProviderName,
      userUuid,
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
      Authorization: `Bearer ${idToken}`,
    },
  });
  return res;
};
