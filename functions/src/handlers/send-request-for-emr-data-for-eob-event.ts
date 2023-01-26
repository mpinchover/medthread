import * as careProviderController from "../controllers/care-providers";
import * as emrController from "../controllers/emr";
export const sendRequestForEMRDataForEOBEvent = async (req: any, res: any) => {
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
    res.status(501).send(e);
  }
};
