import * as userController from "../controllers/user";

export const createHydratedUserProfile = async (req: any, res: any) => {
  try {
    const { body } = req;
    const { profile } = body;

    const createdProfile = await userController.createHydratedUserProfile(
      profile
    );
    res.send({ profile: createdProfile });
  } catch (e) {
    console.log("ERROR IS");
    console.log(e);
    res.status(501).send(e);
  }
};
