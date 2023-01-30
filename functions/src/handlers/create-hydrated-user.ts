import * as userController from "../controllers/user";
import * as careProviderController from "../controllers/care-providers";
export const createHydratedUserProfile = async (req: any, res: any) => {
  try {
    const { body } = req;
    const { profile, providerUuid } = body;

    console.log("BODY IS");
    console.log(body);
    const createdProfile = await userController.createHydratedUserProfile(
      profile
    );

    if (providerUuid) {
      await careProviderController.addAuthorizedHealthcareProviderForPatient(
        createdProfile.userUuid,
        providerUuid
      );
    }
    res.send({ profile: createdProfile });
  } catch (e) {
    console.log("ERROR IS");
    console.log(e);
    res.status(501).send(e);
  }
};
