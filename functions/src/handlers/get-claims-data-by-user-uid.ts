import * as insuranceController from "../controllers/insurance";
export const getClaimsDataByUserUid = async (req: any, res: any) => {
  try {
    const { body, user } = req;
    const userUid = user.user_id;
    // const userUidToReadClaimsFor = req.params.userUid;
    const claimsData = await insuranceController.getClaimsDataByUserUid(
      userUid
    );

    res.send({ claimsData });
  } catch (e) {
    console.log(e);
    res.status(501).send({ error: e });
  }
};
