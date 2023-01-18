import * as insuranceController from "../controllers/insurance";
import { PatientRecordsQueryFilter } from "../types";
import * as careProviderController from "../controllers/care-providers";

// TODO – make another one for the provider
export const getPatientTimelineDataForProvider = async (req: any, res: any) => {
  try {
    console.log("REACHED HERE");
    const { body, user } = req;
    const userUid = user.user_id;
    const { patientUid } = body;

    console.log("REACHED THIS POINT");
    const careProvider =
      await careProviderController.getAuthorizedHealthcareProviderForPatientRecords(
        userUid,
        patientUid
      );

    if (!careProvider) {
      console.log("CARE PROVIDER NOT FOUND");
      throw new Error("care provider not found or not authorized");
    }

    const filter: PatientRecordsQueryFilter = {
      userUid: patientUid,
    };

    const timeline = await insuranceController.getPatientTimeline(filter);

    res.send({ timeline });
  } catch (e) {
    console.log(e);
    res.status(501).send({ error: e });
  }
};
