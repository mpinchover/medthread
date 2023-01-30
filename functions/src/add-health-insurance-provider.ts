import * as insuranceController from "./controllers/insurance";
export const addHealthInsuranceProvider = async (req: any, res: any) => {
  try {
    const { body, auth } = req;
    console.log("BODY IS");
    console.log(body);
    const { publicToken, userUuid } = body;

    const { insuranceProvider, claimsData } =
      await insuranceController.addHealthInsuranceProvider(
        userUuid,
        publicToken
      );

    res.send({ insuranceProvider, claimsData });
  } catch (e) {
    console.log(e);
    res.status(501).send({ error: e });
  }
};
