import * as careProviderController from "../controllers/care-providers";
import * as insuranceController from "../controllers/insurance";
import { PatientRecordsQueryFilter } from "../types/types";
import * as functions from "firebase-functions";
export const getClaimsDataByUserUuidForProvider = async (
  req: any,
  res: any
) => {
  const logger = functions.logger;
  try {
    const { body, userUuid, authUid } = req;
    // const userUuid = user.user_id;
    const { patientUuid } = body;
    // check to see if authorized
    // const userUidToReadClaimsFor = req.params.userUid;

    const careProvider =
      await careProviderController.getAuthorizedHealthcareProviderForPatientRecords(
        authUid,
        userUuid,
        patientUuid
      );

    if (!careProvider)
      throw new Error("care provider not found or not authorized");

    const filter: PatientRecordsQueryFilter = {
      userUuid: patientUuid,
    };

    const claimsData = await insuranceController.getClaimsDataByUserUuid(
      filter
    );
    res.send({ claimsData });
  } catch (e) {
    logger.error(e);
    console.log(e);
    res.status(501).send({ error: e });
  }
};
