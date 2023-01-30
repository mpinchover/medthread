import * as insuranceController from "./controllers/insurance";
import * as functions from "firebase-functions";
export const addHealthInsuranceProvider = async (req: any, res: any) => {
  const logger = functions.logger;
  try {
    const { body, user } = req;
    const { publicToken } = body;

    const userUid = user.user_id;

    const { insuranceProvider, claimsData } =
      await insuranceController.addHealthInsuranceProvider(
        userUid,
        publicToken
      );
    res.send({ insuranceProvider, claimsData });
  } catch (e) {
    logger.error(e);
    console.log(e);
    res.status(501).send({ error: e });
  }
};
