import axios from "axios";
import { getAuth } from "firebase/auth";
import { getServerConfig } from "../config/config";

export const getAccountSettings = async (uid) => {
  const config = getServerConfig();
  const authUser = JSON.parse(localStorage.getItem("med_thread_auth_user"));
  const { idToken, userUuid } = authUser;

  console.log("GETTING THE USER ACCOUNT for " + userUuid);
  let res;
  try {
    res = await axios({
      method: "post",
      url: `${config.baseUrl}/get-user-account`,
      data: {
        userUuid,
      },
      headers: {
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${idToken}`,
      },
    });

    console.log(res.data?.account);
  } catch (e) {
    console.log(e);
    throw e;
  }

  return res?.data?.account;
};
