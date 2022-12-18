import { getAccessToken, getMetadata } from "./gateway/flepxa";
import * as insuranceRepo from "./repo/insurance";
import { InsuranceMetadata, InsuranceProvider } from "./types";

export const addHealthInsuranceProvider = async (req: any, res: any) => {
  try {
    const { body, user } = req;
    const { publicToken } = body;

    const userUid = user.user_id;

    const accessToken = await getAccessToken(publicToken);
    const metadata: InsuranceMetadata = await getMetadata(accessToken);

    // check to see if we've already added this health insurance provider
    const existingInsuranceprovider =
      await insuranceRepo.getInsuranceProviderByUserUidAndName(
        metadata.publisher,
        userUid
      );
    if (existingInsuranceprovider) {
      res.send({ existingInsuranceprovider });
    }

    const newProviderParams: InsuranceProvider = {
      userUid,
      accessToken,
      providerName: metadata.publisher,
      capabilities: metadata.capabilities,
    };

    // check if the health insurance provider already exists
    const newProvider = await insuranceRepo.addInsuranceProviderForPatient(
      newProviderParams
    );

    res.send({ newProvider });
  } catch (e) {
    console.log(e);
    res.status(501).send({ error: e });
  }
};
// // next up, get medications
