import axios from "axios";

export const sendMedicationsToProvider = async (
  healthcareProviderEmail,
  healthcareProviderName,
  patientUid
) => {
  const authUser = JSON.parse(localStorage.getItem("med_thread_auth_user"));
  const { idToken } = authUser;
  // validation – coudl not get the uid
  const res = await axios({
    method: "post",
    url: "http://127.0.0.1:5001/healthcare-f57e8/us-central1/app/send-medications-to-provider",
    data: {
      healthcareProviderEmail,
      healthcareProviderName,
    },
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });
};
