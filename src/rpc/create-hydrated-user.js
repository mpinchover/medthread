import axios from "axios";
import { getServerConfig } from "../config/config";

export const createHydratedUserProfile = async (params) => {
  const config = getServerConfig();

  const res = await axios({
    method: "post",
    url: `${config.baseUrl}/create-hydrated-profile`,
    data: {
      profile: params,
    },
    headers: {},
  });
  return res?.data?.profile;
};
