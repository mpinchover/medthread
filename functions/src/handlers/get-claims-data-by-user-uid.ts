import * as insuranceController from "../controllers/insurance";
export const getClaimsDataByUserUid = async (req: any, res: any) => {
  try {
    const { body, auth } = req;
    const authUid = auth.user_id;

    const { filter, userUuid } = body;

    filter.userUuid = userUuid;
    // const userUidToReadClaimsFor = req.params.userUid;
    const claimsData = await insuranceController.getClaimsDataByUserUuid(
      filter
    );

    res.send({ claimsData });
  } catch (e) {
    console.log(e);
    res.status(501).send({ error: e });
  }
};
