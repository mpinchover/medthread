import * as careProviderController from "../controllers/care-providers";
import * as emrController from "../controllers/emr";
import * as functions from "firebase-functions";
export const sendRequestForEMRDataForEOBEvent = async (req: any, res: any) => {
  const logger = functions.logger;
  try {
    // ensure that this is the correct provider for this patient and that
    // provider is verified.
    const { body, user } = req;
    const providerUid = user.user_id; // provider ui
    const { patientUid, eobUid } = body;

    const careProvider =
      await careProviderController.getAuthorizedHealthcareProviderForPatientRecords(
        providerUid,
        patientUid
      );

    if (!careProvider)
      throw new Error("care provider not found or not authorized");

    await emrController.sendRequestForEMRDataForEOBEvent(
      eobUid,
      providerUid,
      patientUid
    );
    res.send({ success: "success" });
  } catch (e) {
    logger.error(e);
    res.status(501).send(e);
  }
};
