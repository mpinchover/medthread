import axios from "axios";
import { getServerConfig } from "../config/config";
export const getPatientsByHealthcareProviderUid = async () => {
  try {
    const authUser = JSON.parse(localStorage.getItem("med_thread_auth_user"));

    console.log("AUTH USER IS");
    console.log(authUser);

    const { idToken } = authUser;
    const config = getServerConfig();

    const res = await axios({
      method: "post",
      url: `${config.baseUrl}/get-patients-by-healthcare-provider-uid`,
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });
    return res.data?.patients;
  } catch (e) {
    console.log(e);
  }
  return [];
};
