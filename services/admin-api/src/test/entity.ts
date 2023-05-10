import { v4 } from "uuid";
import { constants } from "ethers";
import { DeepPartial } from "typeorm";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { ContractStatus, IContract, IUser, TokenType, UserRole, UserStatus } from "@framework/types";
import { baseTokenURI, EnabledLanguages, imageUrl, testChainId } from "@framework/constants";

import { UserEntity } from "../infrastructure/user/user.entity";

export const generateTestUser = (data: Partial<IUser> = {}): DeepPartial<UserEntity> => {
  return Object.assign(
    {
      language: EnabledLanguages.EN,
      email: `trejgun+${v4()}@gmail.com`,
      displayName: "Trej",
      password: "97a609f782839fa886c8ae797d8d66f4a5138c2b02fb0dcab39ff74b85bc35fe", // My5up3r5tr0ngP@55w0rd
      imageUrl,
      comment: "Fraud!",
      addresses: null,
      sub: v4(),
      userStatus: UserStatus.ACTIVE,
      userRoles: [UserRole.ADMIN],
      chainId: testChainId,
    },
    data,
  );
};

export const generateTestContract = (data: Partial<IContract> = {}): Record<string, any> => {
  return Object.assign(
    {
      address: constants.AddressZero,
      chainId: testChainId,
      title: "Native token",
      description: simpleFormatting,
      merchantId: 1,
      imageUrl,
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
      royalty: 0,
      baseTokenUri: baseTokenURI,
      contractStatus: ContractStatus.ACTIVE,
      contractType: TokenType.NATIVE,
      contractFeatures: [],
    },
    data,
  );
};
