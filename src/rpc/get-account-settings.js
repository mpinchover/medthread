import axios from "axios";
import { getAuth } from "firebase/auth";
import { getServerConfig } from "../config/config";

export const getAccountSettings = async (uid) => {
  const config = getServerConfig();
  const authUser = JSON.parse(localStorage.getItem("med_thread_auth_user"));
  const { idToken } = authUser;

  let res;
  try {
    console.log("WAITING FOR ACCOUNT");
    res = await axios({
      method: "get",
      url: `${config.baseUrl}/get-user-account`,

      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });
    console.log("RETRIEVED");
  } catch (e) {
    console.log(e);
    throw e;
  }

  return res?.data?.account;
};
