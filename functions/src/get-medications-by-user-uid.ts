import * as medicationsRepo from "./repo/medications";

export const getMedicationsByUserUid = async (req: any, res: any) => {
  try {
    const { user } = req;
    const userUid = user.user_id;
    const meds = await medicationsRepo.getMedicationsByUserUid(userUid);
    res.send({ medications: meds });
  } catch (e) {
    console.log(e);
    res.status(501).send({ error: e });
  }
};
