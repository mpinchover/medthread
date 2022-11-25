import axios from "axios";

export const getPreviousPatients = async () => {
  try {
    const authUser = JSON.parse(localStorage.getItem("med_thread_auth_user"));
    const { idToken } = authUser;
    const res = await axios({
      method: "get",
      url: "http://127.0.0.1:5001/healthcare-f57e8/us-central1/app/get-previous-patients",
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });
    return res.data.previousPatients;
  } catch (e) {
    console.log("FAILED");
    console.log(e);
  }
  return [];
};
