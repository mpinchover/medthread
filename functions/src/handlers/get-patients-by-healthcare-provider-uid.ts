import * as admin from "firebase-admin";
import * as careProviderController from "../controllers/care-providers";
import * as functions from "firebase-functions";
export const getPatientsByHealthcareProviderUid = async (
  req: any,
  res: any
) => {
  const logger = functions.logger;
  try {
    const { user } = req;
    const userUid = user.user_id;
    // get the provider uid out of the header
    const patients = await careProviderController.getPatientsForCareProvider(
      userUid
    );
    res.send({ patients });
  } catch (e) {
    logger.error(e);
    console.log(e);
    res.status(500).send({ error: e });
  }
};
