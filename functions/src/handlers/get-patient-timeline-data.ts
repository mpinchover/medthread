import * as insuranceController from "../controllers/insurance";

// TODO – make another one for the provider
export const getPatientTimelineData = async (req: any, res: any) => {
  try {
    console.log("REACHED THIS POINT");
    const { body, user } = req;
    const userUid = user.user_id;

    const timeline = await insuranceController.getPatientTimelineData(userUid);

    console.log("TIMELINE IS");
    console.log(timeline);
    res.send({ timeline });
  } catch (e) {
    console.log(e);
    res.status(501).send({ error: e });
  }
};
