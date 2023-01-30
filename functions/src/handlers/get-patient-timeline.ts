import * as insuranceController from "../controllers/insurance";
import { PatientRecordsQueryFilter } from "../types";

// TODO – make another one for the provider
export const getPatientTimelineData = async (req: any, res: any) => {
  try {
    const { body } = req;

    const { filter, userUuid } = body;

    filter.userUuid = userUuid;

    console.log("FILTER IS ");
    console.log(filter);
    const timeline = await insuranceController.getPatientTimeline(filter);

    res.send({ timeline });
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: e });
  }
};
