import axios from "axios";
import { getServerConfig } from "../config/config";
export const hydrateUserProfile = async (idToken) => {
  const config = getServerConfig();

  const res = await axios({
    method: "get",
    url: `${config.baseUrl}/hydrate-user-profile`,
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });
  return res?.data?.profile;
};
