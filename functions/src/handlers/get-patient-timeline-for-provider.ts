import * as insuranceController from "../controllers/insurance";
import { PatientRecordsQueryFilter } from "../types";
import * as careProviderController from "../controllers/care-providers";

// TODO – make another one for the provider
export const getPatientTimelineDataForProvider = async (req: any, res: any) => {
  try {
    const { body, user } = req;
    const userUid = user.user_id;
    const { patientUid, filter } = body;

    const careProvider =
      await careProviderController.getAuthorizedHealthcareProviderForPatientRecords(
        userUid,
        patientUid
      );

    if (!careProvider) {
      throw new Error("care provider not found or not authorized");
    }

    const timeline = await insuranceController.getPatientTimeline(filter);

    res.send({ timeline });
  } catch (e) {
    console.log(e);
    res.status(501).send({ error: e });
  }
};
