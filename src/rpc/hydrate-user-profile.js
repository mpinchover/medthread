import axios from "axios";
import { getServerConfig } from "../config/config";
export const hydrateUserProfile = async (idToken) => {
  const config = getServerConfig();

  const res = await axios({
    method: "post",
    url: `${config.baseUrl}/hydrate-user-profile`,
    headers: {
      "Access-Control-Allow-Origin": "*",
      Authorization: `Bearer ${idToken}`,
    },
    data: {
      // userUuid: uuid,
    },
  });
  return res?.data?.profile;
};
