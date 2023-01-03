import axios from "axios";

import { getServerConfig } from "../config/config";
export const getClaimsDataByUserUidForProvider = async (patientUid) => {
  const config = getServerConfig();
  const authUser = JSON.parse(localStorage.getItem("med_thread_auth_user"));
  const { idToken } = authUser;

  const res = await axios({
    method: "post",
    url: `${config.baseUrl}/get-claims-data-by-user-uid-for-provider`,
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
    data: {
      patientUid,
    },
  });
  console.log("RES IS");
  console.log(res.data);
  return res?.data?.claimsData;
};
