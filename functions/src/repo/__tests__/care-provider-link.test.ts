import { expect } from "chai";

import { AuthorizedCareProviderLink, Profile } from "../../types/types";
import {
  addAuthorizedHealthcareProviderLink,
  getPatientUuidsByHealthcareProviderUuid,
  getAuthorizedHealthcareProvider,
  getPatientsByHealthcareProviderUuid,
} from "../care-providers";
import { createHydratedUserProfile } from "../repo";

export const runCareProviderTestSuite = () => {
  describe("run care provider test suite", () => {
    before(() => {});

    after(() => {});

    it("add authorized care provider link", async () => {
      try {
        const userUuid = "user-uuid";

        const providerUuid = "provider-uuid";
        const patient1Uuid = "patient-1-uuid";
        const patient2Uuid = "patient-2-uuid";

        let careProviderLink1: AuthorizedCareProviderLink = {
          careProviderUuid: providerUuid,
          patientUuid: patient1Uuid,
          uuid: "uuid-1",
        };

        let careProviderLink2: AuthorizedCareProviderLink = {
          careProviderUuid: providerUuid,
          patientUuid: patient2Uuid,
          uuid: "uuid-2",
        };

        await addAuthorizedHealthcareProviderLink(careProviderLink1);
        await addAuthorizedHealthcareProviderLink(careProviderLink2);

        const patientUuids = await getPatientUuidsByHealthcareProviderUuid(
          providerUuid
        );

        expect(patientUuids.length).to.equal(2);

        let providerLink = await getAuthorizedHealthcareProvider(
          providerUuid,
          patient1Uuid
        );
        expect(providerLink).to.not.be.null;
        expect(providerLink.patientUuid).equal(patient1Uuid);

        providerLink = await getAuthorizedHealthcareProvider(
          providerUuid,
          patient2Uuid
        );
        expect(providerLink).to.not.be.null;
        expect(providerLink.patientUuid).equal(patient2Uuid);

        providerLink = await getAuthorizedHealthcareProvider(
          providerUuid,
          "SOMETHING ELSE"
        );
        expect(providerLink).to.be.null;
      } catch (e) {
        console.log(e);
      }
    });

    it("get patient profiles for provider", async () => {
      const providerUuid = "provider-uuid-10";
      const patient1Uuid = "patient-1-uuid-10";
      const patient2Uuid = "patient-2-uuid-10";

      const profile1: Profile = {
        authUid: "some-auth-uid",
        uuid: patient1Uuid,
        userRole: "PATIENT",
        nameValue: "ALEX",
      };

      const profile2: Profile = {
        authUid: "some-auth-uid-2",
        uuid: patient2Uuid,
        userRole: "PATIENT",
        nameValue: "JOHN",
      };

      await createHydratedUserProfile(profile1);
      await createHydratedUserProfile(profile2);

      let careProviderLink1: AuthorizedCareProviderLink = {
        careProviderUuid: providerUuid,
        patientUuid: patient1Uuid,
        uuid: "uuid-100",
      };

      let careProviderLink2: AuthorizedCareProviderLink = {
        careProviderUuid: providerUuid,
        patientUuid: patient2Uuid,
        uuid: "uuid-200",
      };

      await addAuthorizedHealthcareProviderLink(careProviderLink1);
      await addAuthorizedHealthcareProviderLink(careProviderLink2);

      const profiles = await getPatientsByHealthcareProviderUuid(providerUuid);

      const setOfUuids = new Set([patient1Uuid, patient2Uuid]);
      expect(profiles.length).equal(2);
      for (const profile of profiles) {
        expect(setOfUuids.has(profile.uuid));
        setOfUuids.delete(profile.uuid);
      }
    });
  });
};
