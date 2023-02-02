import axios from "axios";

import { getServerConfig } from "../config/config";
export const getClaimsDataByUserUuidForProvider = async (
  idToken,
  patientUuid,
  providerUuid
) => {
  const config = getServerConfig();
  const authUser = JSON.parse(localStorage.getItem("med_thread_auth_user"));

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
    url: `${config.baseUrl}/get-claims-data-by-user-uuid-for-provider`,
    headers: {
      "Access-Control-Allow-Origin": "*",
      Authorization: `Bearer ${idToken}`,
    },
    data: {
      providerUuid,
      patientUuid,
      filter,
    },
  });

  return res?.data?.claimsData;
};
