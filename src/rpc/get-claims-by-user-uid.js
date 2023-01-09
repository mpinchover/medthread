// /get-claims-data-by-user-uid",
import axios from "axios";

import { getServerConfig } from "../config/config";
export const getClaimsDataByUserUid = async () => {
  const config = getServerConfig();
  const authUser = JSON.parse(localStorage.getItem("med_thread_auth_user"));
  const { idToken } = authUser;

  console.log("GETTING CLAIMS DATA");
  const res = await axios({
    method: "get",
    url: `${config.baseUrl}/get-claims-data-by-user-uid`,
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });
  console.log("GOT CLAIMS DATA");
  return res?.data?.claimsData;
};
