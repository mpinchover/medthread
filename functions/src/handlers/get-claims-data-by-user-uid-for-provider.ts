import * as careProviderController from "../controllers/care-providers";
import * as insuranceController from "../controllers/insurance";
import { PatientRecordsQueryFilter } from "../types";

export const getClaimsDataByUserUidForProvider = async (req: any, res: any) => {
  try {
    const { body, auth } = req;
    const authUid = auth.user_id;
    const { patientUuid, userUuid } = body;
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
    console.log(e);
    res.status(501).send({ error: e });
  }
};
