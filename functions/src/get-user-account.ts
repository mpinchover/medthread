import * as insuranceRepo from "./repo/insurance";
import { Account } from "./types";

export const getUserAccount = async (req: any, res: any) => {
  try {
    const { user } = req;
    const userUid = user.user_id;

    const insuranceProviders =
      await insuranceRepo.getInsuranceProvidersByUserUid(userUid);

    const account: Account = {
      insuranceProviders,
    };

    res.send({ account });
  } catch (e) {
    console.log(e);
    res.status(501).send({ error: e });
  }
};
