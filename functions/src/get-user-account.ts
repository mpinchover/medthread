import * as insuranceRepo from "./repo/insurance";
import * as careProviderRepo from "./repo/care-providers";
import { Account } from "./types";
import * as functions from "firebase-functions";
export const getUserAccount = async (req: any, res: any) => {
  const logger = functions.logger;
  try {
    const { user } = req;
    const userUid = user.user_id;
    let insuranceProviders = await insuranceRepo.getInsuranceProvidersByUserUid(
      userUid
    );
    if (!insuranceProviders) insuranceProviders = [];

    const healthcareProviders =
      await careProviderRepo.getAuthorizedHealthcareProviders(userUid);

    const account: Account = {
      insuranceProviders,
      healthcareProviders,
    };

    res.send({ account });
  } catch (e) {
    logger.error(e);
    console.log("THE PROBLEM IS");
    console.log(e);
    res.status(501).send({ error: e });
  }
};
