import * as userController from "../controllers/user";

export const hydrateUserProfile = async (req: any, res: any) => {
  try {
    const { user } = req;
    const userUid = user.user_id;

    const profile = await userController.hydrateUserProfile(userUid);
    res.send({ profile });
  } catch (e) {
    console.log("ERROR IS");
    console.log(e);
    res.status(501).send(e);
  }
};
