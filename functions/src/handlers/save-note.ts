import * as insuranceController from "../controllers/insurance";
export const saveNote = async (req: any, res: any) => {
  try {
    const { body, user } = req;
    const userUid = user.user_id;
    const { note } = body;

    const savedNote = await insuranceController.saveNote(note);

    res.send({ savedNote });
  } catch (e) {
    console.log(e);
    res.status(501).send({ error: e });
  }
};
