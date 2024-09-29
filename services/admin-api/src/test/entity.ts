import { v4 } from "uuid";
import { ZeroAddress } from "ethers";
import { DeepPartial } from "typeorm";

import { simpleFormatting } from "@ethberry/draft-js-utils";
import { baseTokenURI } from "@ethberry/contracts-constants";
import { wallet } from "@ethberry/constants";
import type { IContract, IUser } from "@framework/types";
import {
  ContractStatus,
  IMerchant,
  MerchantStatus,
  RatePlanType,
  TokenType,
  UserRole,
  UserStatus,
} from "@framework/types";
import { EnabledLanguages, imageUrl, testChainId } from "@framework/constants";

import { UserEntity } from "../infrastructure/user/user.entity";
import { MerchantEntity } from "../infrastructure/merchant/merchant.entity";

export const generateTestMerchant = (data: Partial<IMerchant> = {}): DeepPartial<MerchantEntity> => {
  return Object.assign(
    {
      title: "GEMUNION",
      description: simpleFormatting,
      email: `trejgun+${v4()}@gmail.com`,
      imageUrl,
      wallet,
      merchantStatus: MerchantStatus.ACTIVE,
      // social: IMerchantSocial,
      ratePlan: RatePlanType.GOLD,
      users: [],
      products: [],
      orders: [],
      chainLinkSubscriptions: [],
      refLevels: [],
    },
    data,
  );
};

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
      address: ZeroAddress,
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
