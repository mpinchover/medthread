import axios from "axios";
import { InsuranceMetadata } from "../types";

export const getAccessToken = async (publicToken: string) => {
  const res = await axios({
    method: "post",
    url: "https://api.flexpa.com/link/exchange",
    headers: {
      "Content-Type": "application/json",
      "accept-encoding": "*",
    },
    data: {
      public_token: publicToken,
      secret_key: process.env.FLEXPA_SECRET_KEY,
    },
  });

  return res.data.access_token;
};

export const refreshToken = async (accessToken: string) => {
  // get the health insurance provider data
  const res = await axios({
    method: "post",
    url: "https://api.flexpa.com/link/refresh",
    headers: {
      "Content-Type": "application/json",
      "accept-encoding": "*",
    },
    data: {
      access_token: accessToken,
      secret_key: process.env.FLEXPA_SECRET_KEY,
    },
  });

  return res.data.access_token;
};

export const getMetadataV2 = async (
  accessToken: string
): Promise<InsuranceMetadata> => {
  try {
    let res = await axios.get("https://api.flexpa.com/link/introspect", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "accept-encoding": "*",
      },
    });

    const capabilities: string[] = res.data?.endpoint?.resources;

    const metadata = {
      publisher: res.data?.endpoint?.label,
      capabilities,
    };
    return metadata;
  } catch (e) {
    throw e;
  }
};

export const getMetadata = async (
  accessToken: string
): Promise<InsuranceMetadata> => {
  let res = await axios.get("https://api.flexpa.com/fhir/metadata", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "accept-encoding": "*",
    },
  });

  const capabilities: string[] = res.data.rest[0]?.resource?.map(
    (resource: any) => {
      return resource.type;
    }
  );

  const metadata = {
    publisher: res.data.publisher,
    capabilities,
  };
  return metadata;
};

export const getMedicationByAccessToken = async (accessToken: string) => {
  const res = await axios.get("https://api.flexpa.com/fhir/MedicationRequest", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "accept-encoding": "*",
    },
  });
  return res.data;
};
