import axios from "axios";
import { getAuth } from "firebase/auth";

export const addAuthorizedHealthcareProviderdicationsByUid = async (
  healthcareProviderEmail,
  healthcareProviderName
) => {
  const authUser = JSON.parse(localStorage.getItem("med_thread_auth_user"));
  const { idToken } = authUser;

  // const idToken = await auth.currentUser.getIdToken(/* forceRefresh */ true);

  const res = await axios({
    method: "post",
    url: "http://127.0.0.1:5001/healthcare-f57e8/us-central1/app/add-authorized-healthcare-provider",
    data: {
      healthcareProviderEmail,
      healthcareProviderName,
    },
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });
  return res;
};
