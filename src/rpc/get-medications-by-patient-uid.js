import axios from "axios";
import { getAuth } from "firebase/auth";

// get patient medications by patient uid

export const getMedicationsForPatient = async () => {
  const authUser = JSON.parse(localStorage.getItem("med_thread_auth_user"));
  const { idToken, uid } = authUser;
  const res = await axios({
    method: "post",
    url: "http://127.0.0.1:5001/healthcare-f57e8/us-central1/app/get-medications-by-patient-uid",
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
    data: {
      patientUid: uid,
    },
  });

  const { data } = res;
  if (!data.medications) return [];
  return data.medications;
};
