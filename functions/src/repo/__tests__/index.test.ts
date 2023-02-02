import { expect } from "chai";
import { runWriteClaimsDataTest } from "./write-claims-data.test";
import { runInsuranceTestSuite } from "./insurance.test";
import { runCareProviderTestSuite } from "./care-provider-link.test";
import { runProfilesTestSuite } from "./profiles.test";
import Database from "../mysql";

describe("", () => {
  before(() => {
    console.log("RUNNING THIS BEFORE THE TEST");
  });

  after(() => {
    console.log("RUNNING THIS AFTER THE TEST");
    Database.closeConn();
  });

  it("run test suites", async () => {
    await runWriteClaimsDataTest();
    await runInsuranceTestSuite();
    await runCareProviderTestSuite();
    await runProfilesTestSuite();
    // await Database.closeConn();
  });
});
