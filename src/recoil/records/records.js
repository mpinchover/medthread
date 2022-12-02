import { atom, selector, useRecoilState, useRecoilValue } from "recoil";

const items = [
  {
    itemType: "MEDICATIONS",
    itemName: "Oxycodone",
    date: "2020-05-01",
    medicationType: "Pill",
    dose: "once a day",
    quantityDispensed: 30,
    status: "ACTIVE",
    lastRefil: "Jan 2, 2020",
    prescribedBy: "Dr. Roshni Patel",
    source: "Patient input",
    lastRefill: "2020-01-02",
    dateStopped: "",
  },
  {
    itemType: "MEDICATIONS",
    itemName: "Buprenorphine",
    date: "2022-01-02",

    medicationType: "Pill",
    dose: "once every 4 hours",
    quantityDispensed: 30,
    status: "ACTIVE",

    prescribedBy: "Dr. Kenny Longshorts",
    source: "Patient input",

    lastRefill: "2021-01-02",
    dateStopped: "",
  },
  {
    itemType: "MEDICATIONS",
    itemName: "Cymbalta",
    date: "2021-05-06",

    medicationType: "Pill",
    dose: "every morning",
    quantityDispensed: 30,
    status: "ACTIVE",

    prescribedBy: "Dr. Mary Alo",
    source: "Claims data",
    lastRefill: "2020-01-02",
    dateStopped: "",
  },
  {
    itemType: "MEDICATIONS",
    itemName: "Diazepam",
    date: "2021-05-06",
    medicationType: "Pill",
    dose: "twice a day",
    quantityDispensed: 30,
    status: "ACTIVE",
    lastRefill: "2020-01-02",
    prescribedBy: "Dr. Ron Johnson",
    source: "Claims data",
    dateStopped: "",
  },
  {
    itemType: "IMMUNIZATIONS",
    itemName: "Hepatitis A and hepatitis B vaccine",
    date: "2021-08-06",
    source: "Claims data",
    performer: "Dr. K.C",
  },
  {
    encounterSummary:
      "Lesion of medial popliteal nerve, unspecified lower limb",
    status: "ACTIVE",
    itemType: "DIAGNOSES",
    itemName: "VWP",
    date: "2022-03-06",
    diagnosisSource: "LAB",
    source: "Claims data",
    performer: "Dr. Kenny Longshorts",
  },
  {
    status: "ACTIVE",
    encounterSummary:
      "Lesion of medial popliteal nerve, unspecified lower limb",
    itemType: "DIAGNOSES",
    itemName: "LYBGCR",
    date: "2019-03-06",
    diagnosisSource: "LAB",
    source: "Claims data",
    performer: "Dr. Kenny Longshorts",
  },
  {
    itemType: "PROCEDURES",
    itemName: "EXTERNAL RADIATION DOSIMETRY",
    date: "2021-03-06",

    source: "Claims data",
    performer: "DR. KATE MOSS, M.D",
  },
  {
    itemType: "PROCEDURES",
    itemName: "IORT CYSTSCPY PERF EVAL LW TRCT INJ",
    date: "2021-03-06",

    source: "Claims data",
    performer: "DR. JAMES STALLWORTH, M.D",
  },
  {
    status: "ACTIVE",
    itemType: "ALLERGIES",
    itemName: "IODINE",
    date: "2021-03-06",
    dateStarted: "2021-03-06",
    performer: "DR. ABRAHAM LINCOLN M.D",
    reaction: "Itching",
    source: "Claims data",
  },
  {
    status: "ACTIVE",
    itemType: "ALLERGIES",
    itemName: "BACTRIM",
    date: "2021-03-06",
    dateStarted: "2021-03-06",
    performer: "DR. JOSEPH THOMAS",
    reaction: "Swelling",
    source: "Claims data",
  },
];

export const healthRecordsState = atom({
  key: "healthRecordsState",
  default: items,
});

export const healthRecordsCategoriesState = atom({
  key: "healthRecordsCategoriesState",
  default: ["MEDICATIONS"],
});

export const healthRecordsSearchTermState = atom({
  key: "healthRecordsSearchTermState",
  default: "",
});

export const filteredHealthRecordsState = selector({
  key: "filteredHealthRecordsState",
  get: ({ get }) => {
    const searchTerm = get(healthRecordsSearchTermState);
    const filteredCategories = get(healthRecordsCategoriesState);
    let records = get(healthRecordsState);

    records = records.filter((x) =>
      x.itemName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    records = records.filter((x) => filteredCategories.includes(x.itemType));
    records = records.sort((a, b) => new Date(b.date) - new Date(a.date));

    return records;
  },
});
