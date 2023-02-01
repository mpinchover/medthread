// /get-claims-data-by-user-uid",
import axios from "axios";

import { getServerConfig } from "../config/config";
export const getClaimsDataByUserUid = async (idToken) => {
  const config = getServerConfig();

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
    url: `${config.baseUrl}/get-claims-data-by-user-uid`,
    headers: {
      "Access-Control-Allow-Origin": "*",
      Authorization: `Bearer ${idToken}`,
    },
    data: {
      filter,
    },
  });

  return res?.data?.claimsData;
};
