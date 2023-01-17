import { Profile } from "../types";
import * as repo from "../repo/repo";
export const createHydratedUserProfile = async (profile: Profile) => {
  return await repo.createHydratedUserProfile(profile);
};
