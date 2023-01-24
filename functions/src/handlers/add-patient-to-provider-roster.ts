import * as functions from "firebase-functions";
import * as userController from "../controllers/user";
import * as admin from "firebase-admin";
import { AuthProfile } from "../types";
export const addPatientToProviderRoster = async (req: any, res: any) => {
  const logger = functions.logger;
  try {
    const { body, user } = req;
    const userUid = user.user_id;
    const { email } = body;

    // problem -
    // anyone can make an account and send a request for the patient to sign up.
    // how does the patient know it's really their doctor and not an impersonator?
    // you can maybe send the lanby group 
    // check that ths is a verified provider
    // so just generate the email
    const providerAuthProfile: AuthProfile = await admin
      .auth()
      .getUser(userUid);
    if (providerAuthProfile.emailVerified)
      // then get the auth profile to view the email

      // email the patient from medthread
      userController.sendPatientSignupEmail();
    logger.info({
      message: "PRINTING OUT DEBUG LOG",
    });
  } catch (e) {
    logger.error(e);
  }
};
