import * as userController from "../controllers/user";
import * as careProviderController from "../controllers/care-providers";
import * as functions from "firebase-functions";
export const createHydratedUserProfile = async (req: any, res: any) => {
  const logger = functions.logger;
  try {
    const { body } = req;
    const { profile, providerUid } = body;

    const createdProfile = await userController.createHydratedUserProfile(
      profile
    );

    if (providerUid) {
      await careProviderController.addAuthorizedHealthcareProviderForPatient(
        createdProfile.userUid,
        providerUid
      );
    }
    res.send({ profile: createdProfile });
  } catch (e) {
    const logger = functions.logger;
    logger.error(e);
    console.log(e);
    res.status(501).send(e);
  }
};
