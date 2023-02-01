import axios from "axios";
import { getAuth } from "firebase/auth";
import { getServerConfig } from "../config/config";

export const getAccountSettings = async (uid) => {
  const config = getServerConfig();
  const authUser = JSON.parse(localStorage.getItem("med_thread_auth_user"));
  const { idToken, uuid } = authUser;

  let res;
  try {
    res = await axios({
      method: "post",
      url: `${config.baseUrl}/get-user-account`,
      data: {
        userUuid: uuid,
      },
      headers: {
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${idToken}`,
      },
    });
  } catch (e) {
    console.log(e);
    throw e;
  }

  return res?.data?.account;
};
