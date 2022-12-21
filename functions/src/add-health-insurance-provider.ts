import { getAccessToken, getMetadata, getMetadataV2 } from "./gateway/flepxa";
import * as insuranceRepo from "./repo/insurance";
import * as medicationsRepo from "./repo/medications";
import * as flexpaGateway from "./gateway/flepxa";
import * as medicationsController from "./controllers/medications";
import { InsuranceMetadata, InsuranceProvider } from "./types";

export const addHealthInsuranceProvider = async (req: any, res: any) => {
  try {
    const { body, user } = req;
    const { publicToken } = body;

    const userUid = user.user_id;

    const accessToken = await getAccessToken(publicToken);
    const metadata: InsuranceMetadata = await getMetadataV2(accessToken);

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

    const flexpaMedications = await flexpaGateway.getMedicationByAccessToken(
      accessToken
    );

    const entityMedications =
      medicationsController.fromFlexpaToEntityMedications(flexpaMedications);

    for (let i = 0; i < entityMedications.length; i++) {
      entityMedications[i].userUid = userUid;
      entityMedications[i].source = "CLAIMS";
    }
    // pull all meds for patient on the first of the month
    const medications = await medicationsRepo.addMedicationsInbatch(
      entityMedications
    );

    res.send({ newProvider, medications });
  } catch (e) {
    console.log(e);
    res.status(501).send({ error: e });
  }
};
// // next up, get medications
