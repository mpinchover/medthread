import axios from "axios";
import { getServerConfig } from "../config/config";

export const saveNote = async (note) => {
  const authUser = JSON.parse(localStorage.getItem("med_thread_auth_user"));
  const { idToken } = authUser;
  const config = getServerConfig();

  note.userUid = authUser.uid;
  // validation – coudl not get the uid
  const res = await axios({
    method: "post",
    url: `${config.baseUrl}/save-note`,
    data: {
      note,
    },
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });
  return res.data.savedNote;
};
