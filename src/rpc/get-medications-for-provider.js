import axios from "axios";

export const getMedicationsForProvider = async (patientUid) => {
  const authUser = JSON.parse(localStorage.getItem("med_thread_auth_user"));
  const { idToken } = authUser;

  const res = await axios({
    method: "post",
    url: "http://127.0.0.1:5001/healthcare-f57e8/us-central1/app/get-medications-for-provider",
    data: {
      patientUid,
    },
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });

  console.log("RES");
  console.log(res.data.medications);
  return res.data.medications;
};
