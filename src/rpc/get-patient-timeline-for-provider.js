import axios from "axios";
import { getAuth } from "firebase/auth";
import { getServerConfig } from "../config/config";

export const getPatientTimelineForProvider = async (idToken, patientUid, filter) => {
  const config = getServerConfig();


  filter.userUid = patientUid;
  const res = await axios({
    method: "post",
    url: `${config.baseUrl}/get-patient-timeline-data-for-provider`,
    data: {
      patientUid,
      filter,
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
      Authorization: `Bearer ${idToken}`,
    },
  });
  console.log("DATA IS");
  console.log(res.data?.timeline);

  return res.data?.timeline;
};
