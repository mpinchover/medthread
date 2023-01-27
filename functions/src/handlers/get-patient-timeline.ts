import * as insuranceController from "../controllers/insurance";
import { PatientRecordsQueryFilter } from "../types";

// TODO – make another one for the provider
export const getPatientTimelineData = async (req: any, res: any) => {
  try {
    const { user, body } = req;
    const userUid = user.user_id;
    const { filter } = body;

    const timeline = await insuranceController.getPatientTimeline(filter);

    res.send({ timeline });
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: e });
  }
};
