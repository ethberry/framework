import { v4 } from "uuid";
import { ZeroAddress } from "ethers";
import { DeepPartial } from "typeorm";
import { addDays } from "date-fns";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { wallet } from "@gemunion/constants";
import type { IAsset, IAssetComponent, IClaim, IContract, IMerchant, ITemplate, IUser } from "@framework/types";
import {
  ClaimStatus,
  ClaimType,
  ContractStatus,
  MerchantStatus,
  ModuleType,
  RatePlanType,
  TemplateStatus,
  TokenType,
  UserRole,
  UserStatus,
} from "@framework/types";
import { baseTokenURI, EnabledLanguages, imageUrl, testChainId } from "@framework/constants";

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
      contractModule: ModuleType.HIERARCHY,
      contractFeatures: [],
    },
    data,
  );
};

export const generateTestTemplate = (data: Partial<ITemplate> = {}): Record<string, any> => {
  return Object.assign(
    {
      title: "Native token",
      description: simpleFormatting,
      imageUrl,
      cap: 0,
      amount: 0,
      cid: "test",
      templateStatus: TemplateStatus.ACTIVE,
    },
    data,
  );
};

export interface IAssetDto {}

export const generateTestAsset = (data: Partial<IAsset> = {}): Record<string, any> => {
  return Object.assign(
    {
      components: [],
    },
    data,
  );
};

export interface IAssetComponentDto {
  contract: IContract;
  template: ITemplate;
  asset: IAsset;
}

export const generateTestAssetComponent = (data: Partial<IAssetComponent> = {}): Record<string, any> => {
  return Object.assign(
    {
      tokenType: TokenType.ERC20,
      amount: 10_000,
    },
    data,
  );
};

export const generateTestClaim = (data: Partial<IClaim> = {}): Record<string, any> => {
  return Object.assign(
    {
      account: ZeroAddress,
      claimStatus: ClaimStatus.NEW,
      claimType: ClaimType.TOKEN,
      signature: "",
      nonce: "",
      endTimestamp: `${addDays(new Date(), 1).toISOString()}`,
    },
    data,
  );
};
