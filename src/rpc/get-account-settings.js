import axios from "axios";
import { getAuth } from "firebase/auth";
import { getServerConfig } from "../config/config";

export const getAccountSettings = async (idToken) => {
  const config = getServerConfig();

  let res;
  try {
    res = await axios({
      method: "get",
      url: `${config.baseUrl}/get-user-account`,

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
