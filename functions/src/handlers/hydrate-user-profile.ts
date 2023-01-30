import * as userController from "../controllers/user";

export const hydrateUserProfile = async (req: any, res: any) => {
  try {
    const { body, auth } = req;

    const userUuid = body;
    const authUid = auth.user_id;

    const profile = await userController.hydrateUserProfile(authUid);
    res.send({ profile });
  } catch (e) {
    console.log("ERROR IS");
    console.log(e);
    res.status(501).send(e);
  }
};
