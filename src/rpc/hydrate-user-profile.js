import axios from "axios";
import { getServerConfig } from "../config/config";
export const hydrateUserProfile = async (idToken) => {
  const config = getServerConfig();

  const url = `${config.baseUrl}/hydrate-user-profile`;

 
  const res = await axios({
    method: "post",
    url,
    headers: {
      "Access-Control-Allow-Origin": "*",
      Authorization: `Bearer ${idToken}`,
    },
  });
  console.log("SUCCESS");
  return res?.data?.profile;
};
