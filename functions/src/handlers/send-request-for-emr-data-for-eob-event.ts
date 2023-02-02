import * as careProviderController from "../controllers/care-providers";
import * as emrController from "../controllers/emr";
import * as functions from "firebase-functions";
export const sendRequestForEMRDataForEOBEvent = async (req: any, res: any) => {
  const logger = functions.logger;
  try {
    // ensure that this is the correct provider for this patient and that
    // provider is verified.
    const { body, authUid } = req;
    const { patientUuid, eobUuid, userUuid } = body;

    const careProvider =
      await careProviderController.getAuthorizedHealthcareProviderForPatientRecords(
        authUid,
        userUuid,
        patientUuid
      );

    if (!careProvider)
      throw new Error("care provider not found or not authorized");

    await emrController.sendRequestForEMRDataForEOBEvent(
      eobUuid,
      userUuid,
      patientUuid
    );
    res.send({ success: "success" });
  } catch (e) {
    logger.error(e);
    res.status(501).send(e);
  }
};
