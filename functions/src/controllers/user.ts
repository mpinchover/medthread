import { Profile } from "../types";
import * as repo from "../repo/repo";
import { v4 } from "uuid";

// TODO create auth uuid on the client side
export const createHydratedUserProfile = async (profile: Profile) => {
  profile.userUuid = v4();
  return await repo.createHydratedUserProfile(profile);
};

export const hydrateUserProfile = async (authUid: string) => {
  return await repo.hydrateUserProfile(authUid);
};

// TODO - save auth profile with user uuid, authUid