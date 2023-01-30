import * as insuranceController from "../controllers/insurance";
import { PatientRecordsQueryFilter } from "../types";
import * as careProviderController from "../controllers/care-providers";

// TODO – make another one for the provider
export const getPatientTimelineDataForProvider = async (req: any, res: any) => {
  try {
    const { body, auth } = req;
    const authUid = auth.user_id;
    const { userUuid, filter } = body;

    const careProvider =
      await careProviderController.getAuthorizedHealthcareProviderForPatientRecords(
        authUid,
        userUuid,
        filter.userUuid
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
