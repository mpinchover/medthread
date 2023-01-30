import { Medication } from "./types";
import * as medicationRepo from "./repo/medications";

export const addMedication = async (req: any, res: any) => {
  try {
    const { body } = req;
    const { dateStarted, medicationName } = body;
    // run some validation here

    const params: Medication = {
      dateStarted: new Date(dateStarted),
      medicationName,
    };
    // const medication = await medicationRepo.addMedication(params);
    // res.send({medication});
  } catch (e) {
    res.status(501).send({ error: e });
  }
};
