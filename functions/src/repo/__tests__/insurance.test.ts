import { expect } from "chai";

import { InsuranceProvider } from "../../types/types";
import {
  addInsuranceProviderForPatient,
  getInsuranceProviderByUserUuidAndName,
  getInsuranceProvidersByUserUuid,
} from "../insurance";
import Database from "../mysql";

export const runInsuranceTestSuite = () => {
  describe("test insurance suite", () => {
    before(() => {});

    after(() => {});

    it("add insurance provider for patient", async () => {
      try {
        const userUuid = "user-uuid";

        let insuranceProvider: InsuranceProvider = {
          userUuid,
          accessToken: "access-token",
          providerName: "Humana",
          uuid: "some-uuid",
          capabilities: ["c-1", "c-2"],
        };

        let repoProviderParams = JSON.parse(JSON.stringify(insuranceProvider));
        repoProviderParams.capabilities = JSON.stringify(
          insuranceProvider.capabilities
        );

        await addInsuranceProviderForPatient(repoProviderParams);

        let provider = await getInsuranceProviderByUserUuidAndName(
          "Humana",
          userUuid
        );
        expect(provider).not.to.be.null;

        provider = await getInsuranceProviderByUserUuidAndName(
          "Huma",
          userUuid
        );
        expect(provider).to.be.null;

        let providers = await getInsuranceProvidersByUserUuid(userUuid);
        expect(providers.length).to.equal(1);

        providers = await getInsuranceProvidersByUserUuid("something else");
        expect(providers.length).to.equal(0);

        insuranceProvider = {
          userUuid,
          accessToken: "access-token",
          providerName: "OPTUM",
          uuid: "some-uuid-2",
          capabilities: ["c-1", "c-2"],
        };

        repoProviderParams = JSON.parse(JSON.stringify(insuranceProvider));
        repoProviderParams.capabilities = JSON.stringify(
          insuranceProvider.capabilities
        );

        await addInsuranceProviderForPatient(repoProviderParams);
        providers = await getInsuranceProvidersByUserUuid(userUuid);
        expect(providers.length).to.equal(2);
      } catch (e) {
        console.log(e);
      }
    });
  });
};
