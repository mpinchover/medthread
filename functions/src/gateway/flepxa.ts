import axios from "axios";
import { InsuranceMetadata } from "../types/types";
import * as functions from "firebase-functions";
import { ResultStorage } from "firebase-functions/v1/testLab";
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

export const getFHIRResourceByReference = async (
  accessToken: string,
  link: string
) => {
  const res = await axios.get(`https://api.flexpa.com/fhir/${link}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "accept-encoding": "*",
    },
  });
  return res.data;
};

// TODO – short circuit in case of inifnite loop
export const getExplanationOfBenefit = async (accessToken: string) => {
  const entries = [];
  const logger = functions.logger;

  let link =
    "https://api.flexpa.com/fhir/ExplanationOfBenefit?patient=$PATIENT_ID";

  while (link) {
    const res = await axios.get(link, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "accept-encoding": "*",
      },
    });
    if (!res?.data?.entry) {
      break;
    }

    logger.info({ message: "explanation_of_benefit_result", result: res.data });
    entries.push(...res.data.entry);
    link = null;
    res.data.link.forEach((linkItem: any) => {
      if (linkItem.relation === "next") {
        link = linkItem.url;
      }
    });
  }

  return entries;
};

export const getMedicationByAccessToken = async (accessToken: string) => {
  const res = await axios.get(
    "https://api.flexpa.com/fhir/MedicationRequest?patient=$PATIENT_ID",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "accept-encoding": "*",
      },
    }
  );
  return res.data;
};

export const getAllergyIntolerance = async (accessToken: string) => {
  const logger = functions.logger;
  const entries = [];
  let link =
    "https://api.flexpa.com/fhir/AllergyIntolerance?patient=$PATIENT_ID";

  let count = 0;
  while (link && count < 100) {
    const res = await axios.get(link, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "accept-encoding": "*",
      },
    });
    if (!res?.data?.entry) {
      break;
    }

    logger.info({ message: "explanation_of_benefit_result", result: res.data });
    entries.push(...res.data.entry);
    link = null;
    res.data.link.forEach((linkItem: any) => {
      if (linkItem.relation === "next") {
        link = linkItem.url;
      }
    });
    count++;
  }

  return entries;
};

export const getConditions = async (accessToken: string) => {
  const logger = functions.logger;
  const entries = [];
  let link = "https://api.flexpa.com/fhir/Condition?patient=$PATIENT_ID";

  let count = 0;
  while (link && count < 100) {
    const res = await axios.get(link, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "accept-encoding": "*",
      },
    });
    if (!res?.data?.entry) {
      break;
    }
    logger.info({ message: "conditions_result", result: res.data });
    entries.push(...res.data.entry);
    link = null;
    res.data.link.forEach((linkItem: any) => {
      if (linkItem.relation === "next") {
        link = linkItem.url;
      }
    });
    count++;
  }

  return entries;
};

export const getDiagnosticReport = async (accessToken: string) => {
  const logger = functions.logger;
  const entries = [];
  let link = "https://api.flexpa.com/fhir/DiagnosticReport?patient=$PATIENT_ID";

  let count = 0;
  while (link && count < 100) {
    const res = await axios.get(link, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "accept-encoding": "*",
      },
    });
    if (!res?.data?.entry) {
      break;
    }
    logger.info({ message: "diagnostic_report_result", result: res.data });
    entries.push(...res.data.entry);
    link = null;
    res.data.link.forEach((linkItem: any) => {
      if (linkItem.relation === "next") {
        link = linkItem.url;
      }
    });
    count++;
  }

  return entries;
};

export const getImmunizations = async (accessToken: string) => {
  const logger = functions.logger;
  const entries = [];
  let link = "https://api.flexpa.com/fhir/Immunization?patient=$PATIENT_ID";

  let count = 0;
  while (link && count < 100) {
    const res = await axios.get(link, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "accept-encoding": "*",
      },
    });
    if (!res?.data?.entry) {
      break;
    }
    logger.info({ message: "immunizations_result", result: res.data });
    entries.push(...res.data.entry);
    link = null;
    res.data.link.forEach((linkItem: any) => {
      if (linkItem.relation === "next") {
        link = linkItem.url;
      }
    });
    count++;
  }
  return entries;
};

export const getProcedures = async (accessToken: string) => {
  const logger = functions.logger;
  const entries = [];
  let link = "https://api.flexpa.com/fhir/Procedure?patient=$PATIENT_ID";

  let count = 0;
  while (link && count < 100) {
    const res = await axios.get(link, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "accept-encoding": "*",
      },
    });
    if (!res?.data?.entry) {
      break;
    }
    logger.info({ message: "procedures_result", result: res.data });

    entries.push(...res.data.entry);
    link = null;
    res.data.link.forEach((linkItem: any) => {
      if (linkItem.relation === "next") {
        link = linkItem.url;
      }
    });
    count++;
  }

  return entries;
};

export const getMedicationRequest = async (accessToken: string) => {
  const logger = functions.logger;
  const entries = [];
  let link =
    "https://api.flexpa.com/fhir/MedicationRequest?patient=$PATIENT_ID";

  let count = 0;
  while (link && count < 100) {
    const res = await axios.get(link, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "accept-encoding": "*",
      },
    });
    if (!res?.data?.entry) {
      break;
    }
    logger.info({ message: "medications_request_result", result: res.data });
    entries.push(...res.data.entry);
    link = null;
    res.data.link.forEach((linkItem: any) => {
      if (linkItem.relation === "next") {
        link = linkItem.url;
      }
    });
    count++;
  }

  return entries;
};

export const getMedicationDispense = async (accessToken: string) => {
  const logger = functions.logger;
  const entries = [];
  let link =
    "https://api.flexpa.com/fhir/MedicationDispense?patient=$PATIENT_ID";
  let count = 0;
  while (link && count < 100) {
    const res = await axios.get(link, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "accept-encoding": "*",
      },
    });
    if (!res?.data?.entry) {
      break;
    }
    logger.info({ message: "medication_dispense_result", result: res.data });
    entries.push(...res.data.entry);
    link = null;
    res.data.link.forEach((linkItem: any) => {
      if (linkItem.relation === "next") {
        link = linkItem.url;
      }
    });
    count++;
  }
  return entries;
};

export const getEncounter = async (accessToken: string) => {
  const logger = functions.logger;
  const entries = [];
  let link = "https://api.flexpa.com/fhir/Encounter?patient=$PATIENT_ID";

  let count = 0;
  while (link && count < 100) {
    const res = await axios.get(link, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "accept-encoding": "*",
      },
    });
    if (!res?.data?.entry) {
      break;
    }
    logger.info({ message: "encounter_result", result: res.data });
    entries.push(...res.data.entry);
    link = null;
    res.data.link.forEach((linkItem: any) => {
      if (linkItem.relation === "next") {
        link = linkItem.url;
      }
    });
    count++;
  }

  return entries;
};

export const getCareTeam = async (accessToken: string) => {
  const logger = functions.logger;
  const entries = [];
  let link = "https://api.flexpa.com/fhir/CareTeam?patient=$PATIENT_ID";

  let count = 0;
  while (link && count < 100) {
    const res = await axios.get(link, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "accept-encoding": "*",
      },
    });
    if (!res?.data?.entry) {
      break;
    }
    logger.info({ message: "care_team_result", result: res.data });
    entries.push(...res.data.entry);
    link = null;
    res.data.link.forEach((linkItem: any) => {
      if (linkItem.relation === "next") {
        link = linkItem.url;
      }
    });
    count++;
  }

  return entries;
};

export const getCarePlan = async (accessToken: string) => {
  const logger = functions.logger;
  const entries = [];
  let link = "https://api.flexpa.com/fhir/CarePlan?patient=$PATIENT_ID";

  let count = 0;
  while (link && count < 100) {
    const res = await axios.get(link, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "accept-encoding": "*",
      },
    });
    if (!res?.data?.entry) {
      break;
    }
    logger.info({ message: "care_plan_result", result: res.data });
    entries.push(...res.data.entry);
    link = null;
    res.data.link.forEach((linkItem: any) => {
      if (linkItem.relation === "next") {
        link = linkItem.url;
      }
    });
    count++;
  }

  return entries;
};

export const getDocumentReference = async (accessToken: string) => {
  const logger = functions.logger;
  const entries = [];
  let link =
    "https://api.flexpa.com/fhir/DocumentReference?patient=$PATIENT_ID";

  let count = 0;
  while (link && count < 100) {
    const res = await axios.get(link, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "accept-encoding": "*",
      },
    });
    if (!res?.data?.entry) {
      break;
    }
    logger.info({ message: "document_reference_result", result: res.data });
    entries.push(...res.data.entry);
    link = null;
    res.data.link.forEach((linkItem: any) => {
      if (linkItem.relation === "next") {
        link = linkItem.url;
      }
    });
    count++;
  }

  return entries;
};

export const getPractitioner = async (accessToken: string) => {
  const logger = functions.logger;
  const entries = [];
  let link = "https://api.flexpa.com/fhir/Practitioner?patient=$PATIENT_ID";

  let count = 0;
  while (link && count < 100) {
    const res = await axios.get(link, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "accept-encoding": "*",
      },
    });
    if (!res?.data?.entry) {
      break;
    }
    logger.info({ message: "practitioner_result", result: res.data });
    entries.push(...res.data.entry);
    link = null;
    res.data.link.forEach((linkItem: any) => {
      if (linkItem.relation === "next") {
        link = linkItem.url;
      }
    });
    count++;
  }

  return entries;
};

export const getPractitionerRole = async (accessToken: string) => {
  const logger = functions.logger;
  const entries = [];
  let link = "https://api.flexpa.com/fhir/PractitionerRole?patient=$PATIENT_ID";

  let count = 0;
  while (link && count < 100) {
    const res = await axios.get(link, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "accept-encoding": "*",
      },
    });
    if (!res?.data?.entry) {
      break;
    }
    logger.info({ message: "practitioner_role_result", result: res.data });
    entries.push(...res.data.entry);
    link = null;
    res.data.link.forEach((linkItem: any) => {
      if (linkItem.relation === "next") {
        link = linkItem.url;
      }
    });
    count++;
  }

  return entries;
};

export const getObservation = async (accessToken: string) => {
  const logger = functions.logger;
  const entries = [];
  let link = "https://api.flexpa.com/fhir/Observation?patient=$PATIENT_ID";

  let count = 0;
  while (link && count < 100) {
    const res = await axios.get(link, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "accept-encoding": "*",
      },
    });
    if (!res?.data?.entry) {
      break;
    }

    logger.info({ message: "observation_result", result: res.data });
    entries.push(...res.data.entry);
    link = null;
    res.data.link.forEach((linkItem: any) => {
      if (linkItem?.relation === "next") {
        link = linkItem.url;
      }
    });
    count++;
  }

  return entries;
};
