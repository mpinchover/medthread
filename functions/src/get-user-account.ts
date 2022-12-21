import * as insuranceRepo from "./repo/insurance";
import * as carepProviderRepo from "./repo/care-providers";
import { Account } from "./types";

export const getUserAccount = async (req: any, res: any) => {
  try {
    const { user } = req;
    const userUid = user.user_id;

    let insuranceProviders = await insuranceRepo.getInsuranceProvidersByUserUid(
      userUid
    );
    if (!insuranceProviders) insuranceProviders = [];

    let healthcareProviders =
      await carepProviderRepo.getAuthorizedHealthcareProvider(userUid);
    
      const account: Account = {
      insuranceProviders,
      healthcareProviders,
    };

    res.send({ account });
  } catch (e) {
    console.log(e);
    res.status(501).send({ error: e });
  }
};
