import { v4 } from "uuid";

import { IUser, UserRole, UserStatus } from "@framework/types";
import { EnabledLanguages, imageUrl } from "@framework/constants";

export const generateTestUser = (data: Partial<IUser> = {}): Partial<IUser> => {
  return Object.assign(
    {
      language: EnabledLanguages.EN,
      email: `trejgun+${v4()}@gmail.com`,
      displayName: "Trej",
      password: "97a609f782839fa886c8ae797d8d66f4a5138c2b02fb0dcab39ff74b85bc35fe", // My5up3r5tr0ngP@55w0rd
      imageUrl,
      comment: "Fraud!",
      sub: v4(),
      userStatus: UserStatus.ACTIVE,
      userRoles: [UserRole.USER],
    },
    data,
  );
};
