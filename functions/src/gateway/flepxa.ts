import axios from "axios";

export const getAccessToken = async (publicToken: string) => {
  const res = await axios({
    method: "post",
    url: "https://api.flexpa.com/link/exchange",
    data: {
      public_token: publicToken,
      secret_key: process.env.FLEXPA_SECRET_KEY,
    },
  });

  return res.data.access_token;
};

export const refreshToken = async (accessToken: string) => {
  // get the health insurance provider data
  let res = await axios.post("https://api.flexpa.com/link/refresh", {
    data: {
      access_token: accessToken,
      secret_key: process.env.FLEXPA_SECRET_KEY,
    },
  });

  return res.data.publisher;
};

export const getMetadata = async (accessToken: string) => {
  // get the health insurance provider data
  let res = await axios.get("https://api.flexpa.com/fhir/metadata", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return res.data.publisher;
};
