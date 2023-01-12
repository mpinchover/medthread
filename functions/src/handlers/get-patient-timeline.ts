import * as insuranceController from "../controllers/insurance";

// TODO – make another one for the provider
export const getPatientTimelineData = async (req: any, res: any) => {
  try {
    const { body, user } = req;
    const userUid = user.user_id;

    const { filter } = body;

    filter.userUid = userUid;

    const timeline = await insuranceController.getPatientTimeline(filter);

    res.send({ timeline });
  } catch (e) {
    console.log(e);
    res.status(501).send({ error: e });
  }
};
