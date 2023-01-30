import axios from "axios";

import { getServerConfig } from "../config/config";
export const getClaimsDataByUserUidForProvider = async (patientUuid) => {
  const config = getServerConfig();
  const authUser = JSON.parse(localStorage.getItem("med_thread_auth_user"));
  const { idToken, userUuid } = authUser;

  const filter = {
    encounter: true,
    procedure: true,
    medicationRequest: true,
    medicationDispense: true,
    immunization: true,
    allergyIntolernace: true,
    condition: true,
  };

  const res = await axios({
    method: "post",
    url: `${config.baseUrl}/get-claims-data-by-user-uid-for-provider`,
    headers: {
      "Access-Control-Allow-Origin": "*",
      Authorization: `Bearer ${idToken}`,
    },
    data: {
      patientUuid,
      filter,
      userUuid,
    },
  });

  return res?.data?.claimsData;
};
