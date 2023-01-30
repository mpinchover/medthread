import * as insuranceRepo from "./repo/insurance";
import * as careProviderRepo from "./repo/care-providers";
import { Account } from "./types";

export const getUserAccount = async (req: any, res: any) => {
  try {
    const { auth, body } = req;
    const authUid = auth.user_id;
    const { userUuid } = body;

    console.log(userUuid);
    let insuranceProviders =
      await insuranceRepo.getInsuranceProvidersByUserUuid(userUuid);
    if (!insuranceProviders) insuranceProviders = [];

    // const healthcareProviders =
    //   await careProviderRepo.getAuthorizedHealthcareProviders(userUuid);

    const account: Account = {
      insuranceProviders,
      // healthcareProviders,
    };

    res.send({ account });
  } catch (e) {
    console.log("THE PROBLEM IS");
    console.log(e);
    res.status(501).send({ error: e });
  }
};
