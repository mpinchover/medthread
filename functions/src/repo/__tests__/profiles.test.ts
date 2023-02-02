import { expect } from "chai";

import { InsuranceProvider, Profile } from "../../types/types";
import {
  createHydratedUserProfile,
  hydrateUserProfile,
  getUserProfilesByUuids,
  getUserProfile,
} from "../repo";
import Database from "../mysql";

export const runProfilesTestSuite = () => {
  describe("test profiles suite", () => {
    before(() => {});

    after(() => {});

    it("add insurance provider for patient", async () => {
      try {
        const p1Uuid = "new-uuid-1";
        const p2Uuid = "new-uuid-2";
        const p1AuthUuid = "new-auth-uuid-1";
        const p2AuthUuid = "new-auth-uuid-2";
        const profile1: Profile = {
          uuid: p1Uuid,
          authUid: p1AuthUuid,
          userRole: "PATIENT",
          nameValue: "ALEX",
        };

        const profile2: Profile = {
          uuid: p2Uuid,
          authUid: p2AuthUuid,
          userRole: "PATIENT",
          nameValue: "SMITHY",
        };

        await createHydratedUserProfile(profile1);
        await createHydratedUserProfile(profile2);

        let hydratedUserProfile = await hydrateUserProfile(p1AuthUuid);
        expect(hydratedUserProfile).to.be.not.null;
        expect(hydratedUserProfile.nameValue).to.equal("ALEX");

        hydratedUserProfile = await hydrateUserProfile(p2AuthUuid);
        expect(hydratedUserProfile).to.be.not.null;
        expect(hydratedUserProfile.nameValue).to.equal("SMITHY");

        const profiles = await getUserProfilesByUuids([p1Uuid, p2Uuid]);

        expect(profiles.length).to.equal(2);

        hydratedUserProfile = await getUserProfile(p1Uuid);
        expect(hydratedUserProfile).to.be.not.null;
        expect(hydratedUserProfile.nameValue).to.equal("ALEX");
      } catch (e) {
        console.log(e);
      }
    });
  });
};
