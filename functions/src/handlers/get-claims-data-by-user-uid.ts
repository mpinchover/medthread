import * as insuranceController from "../controllers/insurance";
import * as functions from "firebase-functions";
export const getClaimsDataByUserUid = async (req: any, res: any) => {
  const logger = functions.logger;
  try {
    const { body, user } = req;
    const userUid = user.user_id;

    const { filter } = body;
    filter.userUid = userUid;
    // const userUidToReadClaimsFor = req.params.userUid;
    const claimsData = await insuranceController.getClaimsDataByUserUid(filter);

    res.send({ claimsData });
  } catch (e) {
    logger.error(e);
    console.log(e);
    res.status(501).send({ error: e });
  }
};
