import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getFirestore,
  getDoc,
} from "firebase/firestore";

export const getMedicationByUid = async (uid) => {
  const db = getFirestore();

  const medRef = doc(db, "medications", uid);
  const medDoc = await getDoc(medRef);

  const medication = medDoc.data();
  const medicationId = medDoc.id;
  if (!medication) {
    throw new Error("NOT_FOUND");
  }
  return {
    ...medication,
    uid: medicationId,
  };
};
