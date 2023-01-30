import * as careProviderController from "../controllers/care-providers";
import * as insuranceController from "../controllers/insurance";
import { PatientRecordsQueryFilter } from "../types";
import * as functions from "firebase-functions";
export const getClaimsDataByUserUidForProvider = async (req: any, res: any) => {
  const logger = functions.logger;
  try {
    const { body, user } = req;
    const userUid = user.user_id;
    const { patientUid } = body;
    // check to see if authorized
    // const userUidToReadClaimsFor = req.params.userUid;

    const careProvider =
      await careProviderController.getAuthorizedHealthcareProviderForPatientRecords(
        userUid,
        patientUid
      );

    if (!careProvider)
      throw new Error("care provider not found or not authorized");

    const filter: PatientRecordsQueryFilter = {
      userUid: patientUid,
    };

    const claimsData = await insuranceController.getClaimsDataByUserUid(filter);
    res.send({ claimsData });
  } catch (e) {
    logger.error(e);
    console.log(e);
    res.status(501).send({ error: e });
  }
};
