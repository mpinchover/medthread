import * as userController from "../controllers/user";
import * as functions from "firebase-functions";
export const hydrateUserProfile = async (req: any, res: any) => {
  const logger = functions.logger;
  try {
    const { body, authUid } = req;
    const { userUuid } = body;

    const profile = await userController.hydrateUserProfile(authUid);
    res.send({ profile });
  } catch (e) {
    logger.error(e);
    console.log("ERROR IS");
    console.log(e);
    res.status(501).send(e);
  }
};
