import * as insuranceRepo from "./repo/insurance";

export const removeHealthInsuranceProvider = async (req: any, res: any) => {
  try {
    const { body } = req;
    const { insuranceProviderUid } = body;

    // check if the health insurance provider already exists
    await insuranceRepo.removeHealthInsuranceProvider(insuranceProviderUid);

    res.send({ success: "success" });
  } catch (e) {
    console.log(e);
    res.status(501).send({ error: e });
  }
};
// // next up, get medications
