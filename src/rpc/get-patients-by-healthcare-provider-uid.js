import axios from "axios";
import { getServerConfig } from "../config/config";
export const getPatientsByHealthcareProviderUid = async () => {
  try {
    const authUser = JSON.parse(localStorage.getItem("med_thread_auth_user"));

    const { idToken, userUuid } = authUser;
    const config = getServerConfig();

    const res = await axios({
      method: "post",
      url: `${config.baseUrl}/get-patients-by-healthcare-provider-uid`,
      headers: {
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${idToken}`,
      },
      data: {
        userUuid,
      },
    });
    return res.data?.patients;
  } catch (e) {
    console.log(e);
  }
  return [];
};
