import { v4 } from "uuid";

import { IUser, UserRole, UserStatus } from "@gemunion/framework-types";
import { imageUrl, phoneNumber } from "@gemunion/framework-mocks";
import { DefaultLanguage } from "@gemunion/framework-constants-misc";

export const generateTestUser = (data: Partial<IUser> = {}): Partial<IUser> => {
  return Object.assign(
    {
      language: DefaultLanguage,
      userRoles: [UserRole.CUSTOMER],
      userStatus: UserStatus.ACTIVE,
      email: `trejgun+${v4()}@gmail.com`,
      firstName: "Trej",
      lastName: "Gun",
      password: "97a609f782839fa886c8ae797d8d66f4a5138c2b02fb0dcab39ff74b85bc35fe", // My5up3r5tr0ngP@55w0rd
      phoneNumber,
      imageUrl,
      comment: "Fraud!",
    },
    data,
  );
};
