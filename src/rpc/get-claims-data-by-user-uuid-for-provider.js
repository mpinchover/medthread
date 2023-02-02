import axios from "axios";

import { getServerConfig } from "../config/config";
export const getClaimsDataByUserUuidForProvider = async (patientUuid) => {
  const config = getServerConfig();
  const authUser = JSON.parse(localStorage.getItem("med_thread_auth_user"));
  const { idToken, uuid } = authUser;

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
      userUuid: uuid,
      patientUuid,
      filter,
    },
  });

  return res?.data?.claimsData;
};
