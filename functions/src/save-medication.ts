// import * as medicationsRepo from "./repo/medications";
// import {Medication} from "./types";

// export const saveMedication = async (req: any, res: any) => {
//   try {
//     const {body, user} = req;
//     const {medication} = body;
//     const userUid = user.user_id;

//     medication.source = "PATIENT";
//     let med: Medication;
//     if (medication.uid) {
//       // update med
//       med = await medicationsRepo.updateMedication(medication, medication.uid);
//     } else {
//       // add med
//       medication.userUid = userUid;
//       med = await medicationsRepo.addMedication(medication);
//     }
//     res.send({medication: med});
//   } catch (e) {
//     console.log(e);
//     res.status(501).send({error: e});
//   }
// };
