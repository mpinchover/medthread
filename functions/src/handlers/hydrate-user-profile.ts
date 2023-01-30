import * as userController from "../controllers/user";
import * as functions from "firebase-functions";
export const hydrateUserProfile = async (req: any, res: any) => {
  const logger = functions.logger;
  try {
    const { user } = req;
    const userUid = user.user_id;

    const profile = await userController.hydrateUserProfile(userUid);
    res.send({ profile });
  } catch (e) {
    logger.error(e);
    console.log("ERROR IS");
    console.log(e);
    res.status(501).send(e);
  }
};
