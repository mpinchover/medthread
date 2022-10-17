const jwt_decode = require("jwt-decode");
const admin = require("firebase-admin");
const axios = require("axios");
const { getUserProfile } = require("./repo");

const addHealthInsuranceProvider = async (req, res) => {
  try {
    const { body } = req;

    // get public token
    const { publicToken } = body;

    // get user uid
    const tokenId = req.get("Authorization").split("Bearer ")[1];
    const decoded = await jwt_decode(tokenId);
    const { user_id } = decoded;

    // get access token
    const accessToken = await getAccessToken(publicToken);

    // get publisher
    const publisher = await getMetaData(accessToken);

    const patientProfile = await getUserProfile(user_id);

    let doc;
    if (!patientProfile || !patientProfile) {
      const docRef = await admin
        .firestore()
        .collection("profiles")
        .add({
          userUid: user_id,
          insurance_providers: {
            [publisher]: {
              public_token: publicToken,
              access_token: accessToken,
            },
          },
        });

      const docData = await docRef.get();
      doc = await docData.data();
    } else {
      const profile = patientProfile;

      const existingRef = admin
        .firestore()
        .collection("profiles")
        .doc(profile.uid);

      doc = {
        ...profile,
        insurance_providers: {
          ...profile.insurance_providers,
          [publisher]: {
            public_token: publicToken,
            access_token: accessToken,
          },
        },
      };
      await existingRef.update({
        ...doc,
      });
    }

    res.send({ patient_profile: doc });
  } catch (e) {
    console.log(e);
    const { data, code } = e;
    console.log(code);
    console.log(data);
    res.status(500).send({
      code,
      data,
    });
  }
};

const getAccessToken = async (publicToken) => {
  const res = await axios({
    method: "post",
    url: "https://api.flexpa.com/link/exchange",
    data: {
      public_token: publicToken,
      secret_key: process.env.FLEXPA_SECRET_KEY,
    },
  });

  return res.data.access_token;
};

const getMetaData = async (accessToken) => {
  // get the health insurance provider data
  let res = await axios.get("https://api.flexpa.com/fhir/metadata", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  console.log("DATA IS");
  console.log(res.data);
  return res.data.publisher;
};

module.exports = {
  addHealthInsuranceProvider,
};
