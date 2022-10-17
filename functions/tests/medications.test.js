const expect = require("chai").expect;
const mockMedRes = require("./mock-medication-response.json");
const { processFlexpaMedicationsResponse } = require("../medications");

describe("Our application", function () {
  it("should understand basic mathematical principles", function () {
    expect(5).to.equal(5);
    expect(5).to.not.equal(3);
  });
});

describe("Test flexpa medication response", function () {
  it("success: processed flexpa meds request", function () {
    const expectedResponse = [
      {
        medicationName: "Oxybutynin Chloride",
        lastUpdated: "2021-06-29T06:44:58.171+00:00",
        dose: "100 TABLET in 1 BOTTLE",
      },
      {
        medicationName: "Oxybutynin Chloride",
        lastUpdated: "2021-06-29T06:44:58.188+00:00",
        dose: "100 BLISTER PACK in 1 CARTON  > 1 TABLET in 1 BLISTER PACK (0832-0038-89)",
      },
      {
        medicationName: "Zithromax",
        lastUpdated: "2021-06-29T06:44:58.188+00:00",
        dose: "50 BLISTER PACK in 1 BOX, UNIT-DOSE  > 1 TABLET, FILM COATED in 1 BLISTER PACK",
      },
      {
        medicationName: "UNKNOWN",
        dose: "2000 TABLET, EXTENDED RELEASE in 1 BAG",
        lastUpdated: "2021-06-29T05:35:33.081+00:00",
      },
      {
        medicationName: "UNKNOWN",
        dose: "1 kg in 1 BOTTLE, GLASS",
        lastUpdated: "2021-06-29T06:33:34.714+00:00",
      },
      {
        medicationName: "UNKNOWN",
        dose: "37500 TABLET, ORALLY DISINTEGRATING in 1 DRUM",
        lastUpdated: "2021-06-29T06:56:23.735+00:00",
      },
      {
        medicationName: "UNKNOWN",
        dose: "1 BAG in 1 DRUM  > 185000 CAPSULE, EXTENDED RELEASE in 1 BAG",
        lastUpdated: "2021-06-29T06:33:34.933+00:00",
      },
      {
        medicationName: "UNKNOWN",
        dose: "1 BAG in 1 DRUM  > 150000 CAPSULE, EXTENDED RELEASE in 1 BAG",
        lastUpdated: "2021-06-29T05:47:11.026+00:00",
      },
      {
        medicationName: "UNKNOWN",
        dose: "25 kg in 1 DRUM",
        lastUpdated: "2021-06-29T05:11:52.44+00:00",
      },
      {
        medicationName: "UNKNOWN",
        dose: "128000 CAPSULE, EXTENDED RELEASE in 1 DRUM",
        lastUpdated: "2021-06-29T06:33:35.366+00:00",
      },
    ];

    const res = processFlexpaMedicationsResponse(mockMedRes);
    expect(expectedResponse).to.eql(res);
  });
});
