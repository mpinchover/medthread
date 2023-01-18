import * as insuranceRepo from "./repo/insurance";
import * as careProviderRepo from "./repo/care-providers";
import { Account } from "./types";

export const getUserAccount = async (req: any, res: any) => {
  try {
    console.log("CALLING FN");
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
    console.log("THE PROBLEM IS");
    console.log(e);
    res.status(501).send({ error: e });
  }
};
