import * as medicationsController from "./controllers/medications";

export const getMedicationsByUserUid = async (req: any, res: any) => {
  try {
    const {user} = req;
    const userUid = user.user_id;

    const medications = await medicationsController.getMedicationsByUserUid(
        userUid
    );

    res.send({medications});
  } catch (e) {
    console.log(e);
    res.status(501).send({error: e});
  }
};
