import { Profile } from "../types/types";
import * as repo from "../repo/repo";
import * as uuid from "uuid";
export const createHydratedUserProfile = async (profile: Profile) => {
  profile.uuid = uuid.v4();
  return await repo.createHydratedUserProfile(profile);
};

export const hydrateUserProfile = async (authUid: string) => {
  return await repo.hydrateUserProfile(authUid);
};
