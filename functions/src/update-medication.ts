import {Medication} from "./types";
import * as medicationRepo from "./repo/medications";

export const updateMedication = async (req: any, res: any) => {
  try {
    const {body} = req;
    const {updateParams, medUid} = body;
    // run some validation here

    const medication = await medicationRepo.updateMedication(
        updateParams,
        medUid
    );
    res.send({medication});
  } catch (e) {
    res.status(501).send({error: e});
  }
};
