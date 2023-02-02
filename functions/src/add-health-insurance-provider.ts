import * as insuranceController from "./controllers/insurance";
import * as functions from "firebase-functions";
export const addHealthInsuranceProvider = async (req: any, res: any) => {
  const logger = functions.logger;
  try {
    const { body, authUid } = req;
    const { publicToken, userUuid } = body;

    const { insuranceProvider, claimsData } =
      await insuranceController.addHealthInsuranceProvider(
        userUuid,
        publicToken
      );
    res.send({ insuranceProvider, claimsData });
  } catch (e) {
    // logger.error(e);
    console.log(e);
    res.status(501).send({ error: e });
  }
};
