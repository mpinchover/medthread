import axios from "axios";
import { getAuth } from "firebase/auth";
import { getServerConfig } from "../config/config";

export const getAccountSettings = async (uid) => {
  const config = getServerConfig();
  const authUser = JSON.parse(localStorage.getItem("med_thread_auth_user"));
  const { idToken } = authUser;

  const res = await axios({
    method: "get",
    url: `${config.baseUrl}/get-user-account`,

    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });

  return res?.data?.account;
};
