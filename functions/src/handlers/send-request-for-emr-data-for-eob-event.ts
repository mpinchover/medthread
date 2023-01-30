import * as careProviderController from "../controllers/care-providers";
import * as emrController from "../controllers/emr";
export const sendRequestForEMRDataForEOBEvent = async (req: any, res: any) => {
  try {
    // ensure that this is the correct provider for this patient and that
    // provider is verified.
    const { body, auth } = req;
    const authUid = auth.user_id;

    const { patientUuid, providerUuid, eobUuid } = body;

    const careProvider =
      await careProviderController.getAuthorizedHealthcareProviderForPatientRecords(
        authUid,
        providerUuid,
        patientUuid
      );

    if (!careProvider)
      throw new Error("care provider not found or not authorized");

    await emrController.sendRequestForEMRDataForEOBEvent(
      eobUuid,
      providerUuid,
      patientUuid
    );
    res.send({ success: "success" });
  } catch (e) {
    res.status(501).send(e);
  }
};
