import * as admin from "firebase-admin";
import * as careProviderController from "../controllers/care-providers";

export const getPatientsByHealthcareProviderUid = async (
  req: any,
  res: any
) => {
  try {
    const { body } = req;
    const { userUuid } = body;

    // get the provider uid out of the header
    const patients = await careProviderController.getPatientsForCareProvider(
      userUuid
    );
    res.send({ patients });
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: e });
  }
};
