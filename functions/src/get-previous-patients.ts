import {getPatientsByProviderUid} from "./repo/repo";
import * as admin from "firebase-admin";

export const getPreviousPatients = async (req: any, res: any) => {
  try {
    const tokenId = req.get("Authorization").split("Bearer ")[1];

    const decodedToken = await admin.auth().verifyIdToken(tokenId);
    const providerUid = decodedToken.uid;

    // get the provider uid out of the header
    const previousPatients = await getPatientsByProviderUid(providerUid);
    res.send({previousPatients});
  } catch (e) {
    console.log(e);
    res.status(500).send({error: e});
  }
};
