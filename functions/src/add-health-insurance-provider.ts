import * as insuranceController from "./controllers/insurance";
export const addHealthInsuranceProvider = async (req: any, res: any) => {
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
    console.log(e);
    res.status(501).send({ error: e });
  }
};
