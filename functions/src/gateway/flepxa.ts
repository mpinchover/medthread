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

// has the label
export const getMetadata = async (
  accessToken: string
): Promise<InsuranceMetadata> => {
  const res = await axios.get("https://api.flexpa.com/link/introspect", {
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
};

// // has the label
// export const _getMetadataV2 = async (
//   accessToken: string
// ): Promise<InsuranceMetadata> => {
//   return new Promise(async (resolve, reject) => {
//     const res = await axios.get("https://api.flexpa.com/link/introspect", {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//         "Content-Type": "application/json",
//         "accept-encoding": "*",
//       },
//     });
//     const capabilities: string[] = res.data?.endpoint?.resources;

//     const metadata = {
//       publisher: res.data?.endpoint?.label,
//       capabilities,
//     };
//     resolve(metadata);
//   });
// };

// export const getMetadata = async (
//   accessToken: string
// ): Promise<InsuranceMetadata> => {
//   try {
//     const metadataValues: any = await Promise.all([
//       _getMetadata(accessToken),
//       _getMetadataV2(accessToken),
//     ]);
//     console.log(metadataValues);

//     const metadata: InsuranceMetadata = metadataValues[0];
//     return metadata;
//   } catch (e) {
//     throw e;
//   }
// };

// export const getMetadataV2 = async (
//   accessToken: string
// ): Promise<InsuranceMetadata> => {

//   try {
//     const res = await axios.get("https://api.flexpa.com/link/introspect", {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//         "Content-Type": "application/json",
//         "accept-encoding": "*",
//       },
//     });

//     const capabilities: string[] = res.data?.endpoint?.resources;

//     const metadata = {
//       publisher: res.data?.endpoint?.label,
//       capabilities,
//     };
//     return metadata;
//   } catch (e) {
//     throw e;
//   }
// };

// export const _getMetadata = async (
//   accessToken: string
// ): Promise<InsuranceMetadata> => {
//   return new Promise(async (resolve, reject) => {
//     const res = await axios.get("https://api.flexpa.com/fhir/metadata", {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//         "Content-Type": "application/json",
//         "accept-encoding": "*",
//       },
//     });

//     const capabilities: string[] = res.data.rest[0]?.resource?.map(
//       (resource: any) => {
//         return resource.type;
//       }
//     );

//     const metadata = {
//       publisher: res.data.publisher,
//       capabilities,
//     };
//     resolve(metadata);
//   });
// };

// export const getMetadata = async (
//   accessToken: string
// ): Promise<InsuranceMetadata> => {
//   const res = await axios.get("https://api.flexpa.com/fhir/metadata", {
//     headers: {
//       Authorization: `Bearer ${accessToken}`,
//       "Content-Type": "application/json",
//       "accept-encoding": "*",
//     },
//   });

//   const capabilities: string[] = res.data.rest[0]?.resource?.map(
//     (resource: any) => {
//       return resource.type;
//     }
//   );

//   const metadata = {
//     publisher: res.data.publisher,
//     capabilities,
//   };
//   return metadata;
// };

export const getMedicationByAccessToken = async (accessToken: string) => {
  const res = await axios.get("https://api.flexpa.com/fhir/MedicationRequest", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "accept-encoding": "*",
    },
  });
  return res.data;
};

export const getAllergyIntolerance = async (accessToken: string) => {
  const res = await axios.get(
    "https://api.flexpa.com/fhir/AllergyIntolerance",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "accept-encoding": "*",
      },
    }
  );
  return res.data;
};

export const getConditions = async (accessToken: string) => {
  const res = await axios.get("https://api.flexpa.com/fhir/Condition", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "accept-encoding": "*",
    },
  });
  return res.data;
};

export const getImmunizations = async (accessToken: string) => {
  const res = await axios.get("https://api.flexpa.com/fhir/Immunization", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "accept-encoding": "*",
    },
  });
  return res.data;
};

export const getProcedures = async (accessToken: string) => {
  const res = await axios.get("https://api.flexpa.com/fhir/Procedure", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "accept-encoding": "*",
    },
  });
  return res.data;
};

export const getMedicationRequest = async (accessToken: string) => {
  try {
    const res = await axios.get(
      "https://api.flexpa.com/fhir/MedicationRequest",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "accept-encoding": "*",
        },
      }
    );

    return res.data;
  } catch (e) {
    console.log(e);
  }
};

export const getMedicationDispense = async (accessToken: string) => {
  const res = await axios.get(
    "https://api.flexpa.com/fhir/MedicationDispense",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "accept-encoding": "*",
      },
    }
  );
  return res.data;
};
