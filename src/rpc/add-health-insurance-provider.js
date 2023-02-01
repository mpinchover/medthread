import axios from "axios";
import { getServerConfig } from "../config/config";

export const addHealthInsuranceProvider = async (idToken, publicToken) => {
  const config = getServerConfig();

  const res = await axios({
    method: "post",
    url: `${config.baseUrl}/add-health-insurance-provider`,
    data: {
      publicToken,
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
      Authorization: `Bearer ${idToken}`,
    },
  });

  const { insuranceProvider, claimsData } = res.data;

  return {
    insuranceProvider,
    claimsData,
  };
  // should we get the medications from this provider?
};
// needs server side for pulling meds, getting capabilites, etc
