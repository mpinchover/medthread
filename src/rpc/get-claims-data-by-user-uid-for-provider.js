import axios from "axios";

import { getServerConfig } from "../config/config";
export const getClaimsDataByUserUidForProvider = async (
  idToken,
  patientUid
) => {
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
    url: `${config.baseUrl}/get-claims-data-by-user-uid-for-provider`,
    headers: {
      "Access-Control-Allow-Origin": "*",
      Authorization: `Bearer ${idToken}`,
    },
    data: {
      patientUid,
      filter,
    },
  });

  return res?.data?.claimsData;
};
