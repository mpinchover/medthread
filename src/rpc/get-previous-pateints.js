import axios from "axios";
import { getServerConfig } from "../config/config";
export const getPreviousPatients = async () => {
  try {
    const authUser = JSON.parse(localStorage.getItem("med_thread_auth_user"));
    const { idToken } = authUser;
    const config = getServerConfig();

    const res = await axios({
      method: "get",
      url: `${config.baseUrl}/get-previous-patients`,
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });
    return res.data.previousPatients;
  } catch (e) {
    console.log("FAILED");
    console.log(e);
  }
  return [];
};
