import * as insuranceController from "../controllers/insurance";
import { PatientRecordsQueryFilter } from "../types/types";
import * as careProviderController from "../controllers/care-providers";
import * as functions from "firebase-functions";
// TODO – make another one for the provider
export const getPatientTimelineDataForProvider = async (req: any, res: any) => {
  const logger = functions.logger;
  try {
    const { body, authUid } = req;
    // const userUid = user.user_id;
    const { patientUuid, filter, providerUuid } = body;

    console.log("CALLING TIMLINEE");

    console.log(body);

    const careProvider =
      await careProviderController.getAuthorizedHealthcareProviderForPatientRecords(
        authUid,
        providerUuid,
        patientUuid
      );

    if (!careProvider) {
      throw new Error("care provider not found or not authorized");
    }

    const timeline = await insuranceController.getPatientTimeline(filter);

    res.send({ timeline });
  } catch (e) {
    logger.error(e);
    console.log(e);
    res.status(501).send({ error: e });
  }
};
