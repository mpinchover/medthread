import * as medicationsRepo from "./repo/medications";
import { Medication } from "./types";

export const removeMedication = async (req: any, res: any) => {
  try {
    const { body, user } = req;
    const { medUid } = body;
    const userUid = user.user_id;

    await medicationsRepo.removeMediation(medUid);

    res.send({ success: "success" });
  } catch (e) {
    console.log(e);
    res.status(501).send({ error: e });
  }
};
