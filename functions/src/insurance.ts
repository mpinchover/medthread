// // const admin = require("firebase-admin");
// import * as admin from "firebase-admin";
// import { getAccessToken, getMetadata } from "./gateway/flepxa";
// // const axios = require("axios");
// import { getUserProfile } from "./repo/repo";
// import { Profile } from "./types";

// const addHealthInsuranceProvider = async (req: any, res: any) => {
//   try {
//     const { body } = req;

//     // get public token
//     const { publicToken } = body;

//     // get user uid
//     const tokenId = req.get("Authorization").split("Bearer ")[1];

//     const decodedToken = await admin.auth().verifyIdToken(tokenId);
//     const userUid = decodedToken.uid;

//     // get access token
//     const accessToken: string = await getAccessToken(publicToken);

//     // get publisher
//     const publisher: string = await getMetadata(accessToken);

//     const patientProfile: Profile = await getUserProfile(userUid);

//     let doc;
//     if (!patientProfile || !patientProfile) {
//       const docRef = await admin
//         .firestore()
//         .collection("profiles")
//         .add({
//           userUid,
//           insurance_providers: {
//             [publisher]: {
//               public_token: publicToken,
//               access_token: accessToken,
//             },
//           },
//         });

//       const docData = await docRef.get();
//       doc = await docData.data();
//     } else {
//       const profile = patientProfile;

//       const existingRef = admin
//         .firestore()
//         .collection("profiles")
//         .doc(profile.uid);

//       doc = {
//         ...profile,
//         insurance_providers: {
//           ...profile.insurance_providers,
//           [publisher]: {
//             public_token: publicToken,
//             access_token: accessToken,
//           },
//         },
//       };
//       await existingRef.update({
//         ...doc,
//       });
//     }

//     res.send({ patient_profile: doc });
//   } catch (e) {
//     console.log(e);
//     console.log(e);

//     res.status(500).send({
//       code,
//       data,
//     });
//   }
// };

// module.exports = {
//   addHealthInsuranceProvider,
// };
