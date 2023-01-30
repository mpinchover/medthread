import axios from "axios";
import { getServerConfig } from "../config/config";

export const getPatientProfileForProviderByUid = async (patientUuid) => {
  const authUser = JSON.parse(localStorage.getItem("med_thread_auth_user"));
  const { idToken, userUuid } = authUser;
  const config = getServerConfig();

  const res = await axios({
    method: "post",
    url: `${config.baseUrl}/get-patient-profile-for-provider-by-uid`,
    data: {
      patientUuid,
      userUuid,
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
      Authorization: `Bearer ${idToken}`,
    },
  });
  return res.data.patient;
};
