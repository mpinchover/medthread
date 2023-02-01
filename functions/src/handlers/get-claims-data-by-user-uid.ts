import * as insuranceController from "../controllers/insurance";
import * as functions from "firebase-functions";
export const getClaimsDataByUserUuid = async (req: any, res: any) => {
  const logger = functions.logger;
  try {
    const { body, userUuid } = req;

    const { filter } = body;
    filter.userUuid = userUuid;
    // const userUidToReadClaimsFor = req.params.userUid;
    const claimsData = await insuranceController.getClaimsDataByUserUuid(
      filter
    );

    res.send({ claimsData });
  } catch (e) {
    logger.error(e);
    console.log(e);
    res.status(501).send({ error: e });
  }
};
