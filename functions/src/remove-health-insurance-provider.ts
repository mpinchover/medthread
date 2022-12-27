import * as insuranceRepo from "./repo/insurance";
import * as medicationsRepo from "./repo/medications";

export const removeHealthInsuranceProvider = async (req: any, res: any) => {
  try {
    const { body, user } = req;
    const { insuranceProviderUid } = body;

    const userUid = user.user_id;

    // check if the health insurance provider already exists
    await insuranceRepo.removeHealthInsuranceProvider(insuranceProviderUid);
    const medications =
      await medicationsRepo.getMedicationsByInsuranceProviderUid(
        userUid,
        insuranceProviderUid
      );
      

    const docUids = medications.map((med) => med.uid);

    await medicationsRepo.removeMedicationsByUids(docUids);

    res.send({ success: "success" });
  } catch (e) {
    console.log(e);
    res.status(501).send({ error: e });
  }
};
