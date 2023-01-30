import axios from "axios";
import { getServerConfig } from "../config/config";

export const createHydratedUserProfile = async (params, providerUid) => {
  const config = getServerConfig();

  const res = await axios({
    method: "post",
    url: `${config.baseUrl}/create-hydrated-profile`,
    data: {
      profile: params,
      providerUid,
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });
  return res?.data?.profile;
};
