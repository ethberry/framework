import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

import { ns } from "@framework/constants";
import {
  createDomainUint256,
  createLanguageEnum,
  createSchema,
  createTokenTypes,
  installExtensionUUID,
} from "@gemunion/nest-js-module-typeorm-helpers";

import { UserEntity } from "./user/user.entity";
import { OtpEntity } from "./otp/otp.entity";
import { SettingsEntity } from "./settings/settings.entity";
import { ContractManagerEntity } from "./blockchain/contract-manager/contract-manager.entity";
import { ContractEntity } from "./blockchain/hierarchy/contract/contract.entity";
import { TemplateEntity } from "./blockchain/hierarchy/template/template.entity";
import { TokenEntity } from "./blockchain/hierarchy/token/token.entity";
import { BalanceEntity } from "./blockchain/hierarchy/balance/balance.entity";
import { AssetEntity } from "./mechanics/asset/asset.entity";
import { AssetComponentEntity } from "./mechanics/asset/asset-component.entity";
import { AccessControlEntity } from "./blockchain/access-control/access-control.entity";
import { AccessListEntity } from "./blockchain/access-list/access-list.entity";
import { ClaimEntity } from "./mechanics/claim/claim.entity";
import { LootboxEntity } from "./mechanics/lootbox/lootbox.entity";
import { StakingStakesEntity } from "./mechanics/staking/staking-stakes/staking-stakes.entity";
import { CraftEntity } from "./mechanics/craft/craft.entity";
import { StakingRulesEntity } from "./mechanics/staking/staking-rules/staking-rules.entity";
import { StakingHistoryEntity } from "./mechanics/staking/staking-history/staking-history.entity";
import { PageEntity } from "./page/page.entity";
import { GradeEntity } from "./mechanics/grade/grade.entity";

import { CreateUser1563804000030 } from "./migrations/1563804000030-create-user";
import { SeedUser1563804000040 } from "./migrations/1563804000040-seed-user";
import { CreateOtp1563804000060 } from "./migrations/1563804000060-create-otp";

import { CreateAsset1563804000100 } from "./migrations/1563804000100-create-asset";

import { CreateContract1563804000100 } from "./migrations/1563804000100-create-contract";
import { SeedContractErc20At1563804000120 } from "./migrations/1563804000120-seed-contract-erc20";
import { SeedContractErc721At1563804000130 } from "./migrations/1563804000130-seed-contract-erc721";
import { SeedContractErc998At1563804000140 } from "./migrations/1563804000140-seed-contract-erc998";
import { SeedContractErc1155At1563804000150 } from "./migrations/1563804000150-seed-contract-erc1155";
import { SeedContractLootboxAt1563804000160 } from "./migrations/1563804000160-seed-contract-lootbox";

import { CreateTemplate1563804000200 } from "./migrations/1563804000200-create-template";
import { SeedTemplateErc20At1563804000220 } from "./migrations/1563804000220-seed-template-erc20";
import { SeedTemplateErc721At1563804000230 } from "./migrations/1563804000230-seed-template-erc721";
import { SeedTemplateErc998At1563804000240 } from "./migrations/1563804000240-seed-template-erc998";
import { SeedTemplateErc1155At1563804000250 } from "./migrations/1563804000250-seed-template-erc1155";
import { SeedTemplateLootboxAt1563804000230 } from "./migrations/1563804000260-seed-template-lootbox";

import { CreateToken1563804000300 } from "./migrations/1563804000300-create-token";
import { SeedTokenErc20At1563804000320 } from "./migrations/1563804000320-seed-token-erc20";
import { SeedTokenErc721At1563804000330 } from "./migrations/1563804000330-seed-token-erc721";
import { SeedTokenErc998At1563804000340 } from "./migrations/1563804000340-seed-token-erc998";
import { SeedTokenErc1155At1563804000350 } from "./migrations/1563804000350-seed-token-erc1155";

import { CreateBalanceTable1563804000400 } from "./migrations/1563804000400-create-balance";
import { SeedBalanceErc20At1563804020420 } from "./migrations/1563804000420-seed-balance-erc20";
import { SeedBalanceErc721At1563804020430 } from "./migrations/1563804000430-seed-balance-erc721";
import { SeedBalanceErc998At1563804020440 } from "./migrations/1563804000440-seed-balance-erc998";
import { SeedBalanceErc1155At1563804020450 } from "./migrations/1563804000450-seed-balance-erc1155";

import { CreateAssetComponent1563804001220 } from "./migrations/1563804001220-create-asset-component";
import { SeedAssetComponentsErc721At1563804001230 } from "./migrations/1563804001230-seed-asset-component-erc721";
import { SeedAssetComponentsErc998At1563804001240 } from "./migrations/1563804001240-seed-asset-component-erc998";
import { SeedAssetComponentsErc1155At1563804001250 } from "./migrations/1563804001250-seed-asset-component-erc1155";

import { CreateContractHistory1563804040330 } from "./migrations/1563804040330-create-contract-history";
import { CreateVesting1563804010210 } from "./migrations/1563804010210-create-vesting";
import { SeedVesting1563804010220 } from "./migrations/1563804010220-seed-vesting";
import { CreateVestingHistory1563804010230 } from "./migrations/1563804010230-create-vesting-history";

import { CreateClaimTable1563804040410 } from "./migrations/1653616447810-create-claim";
import { SeedClaimErc721At1563804040420 } from "./migrations/1653616447820-seed-claim-erc721";

import { CreateLootbox1653616447910 } from "./migrations/1653616447910-create-lootbox";
import { SeedLootboxErc721At1653616447920 } from "./migrations/1653616447920-seed-lootbox-erc721";

import { CreateCraft1653616448010 } from "./migrations/1653616448010-create-craft";
import { SeedCraftErc1155Erc1155At1653616448020 } from "./migrations/1653616448020-seed-craft-erc1155-erc1155";
import { SeedCraftErc721Erc1155At1653616448030 } from "./migrations/1653616448030-seed-craft-erc721-erc1155-recipe";

import { VestingEntity } from "./mechanics/vesting/vesting.entity";
import { CreateContractManagerHistory1652682493386 } from "./migrations/1652682493386-create-contract-manager-history";
import { CreateContractManager1652962207600 } from "./migrations/1652962207600-create-contract-manager";
import { SeedContractManager1652962207610 } from "./migrations/1652962207610-seed-contract-manager";
import { CreateAccessControl1653616447230 } from "./migrations/1653616447230-create-access-control";
import { CreateAccessControlHistory1653616447240 } from "./migrations/1653616447240-create-access-control-history";
import { CreateAccessList1653616447330 } from "./migrations/1653616447330-create-access-list";
import { SeedAccessList1653616447340 } from "./migrations/1653616447340-seed-access-list";
import { CreateAccessListHistory1653616447350 } from "./migrations/1653616447350-create-access-list-history";
import { CreateSettings1563804000010 } from "./migrations/1563804000010-create-settings";
import { SeedSettings1563804000020 } from "./migrations/1563804000020-seed-settings";

import { CreateStakingRules1654751224200 } from "./migrations/1654751224200-create-staking-rules";
import { SeedStakingRulesErc721At1654751224230 } from "./migrations/1654751224230-seed-staking-rules-erc721";
import { SeedStakingRulesNativeAt1654751224210 } from "./migrations/1654751224210-seed-staking-rules-native";
import { SeedStakingRulesErc20At1654751224220 } from "./migrations/1654751224220-seed-staking-rules-erc20";
import { SeedStakingRulesErc998At1654751224240 } from "./migrations/1654751224240-seed-staking-rules-erc998";
import { SeedStakingRulesErc1155At1654751224250 } from "./migrations/1654751224250-seed-staking-rules-erc1155";

import { CreateStakes1654751224300 } from "./migrations/1654751224300-create-stakes";
import { SeedStakes1654751224310 } from "./migrations/1654751224310-seed-stakes";
import { CreateStakingHistory1654751224400 } from "./migrations/1654751224400-create-staking-history";

import { CreatePage1655626535100 } from "./migrations/1655626535100-create-page";
import { SeedPages1655626535110 } from "./migrations/1655626535110-seed-pages";
import { CreateGrade1657846587000 } from "./migrations/1657846587000-create-grade";
import { SeedGrade1657846587010 } from "./migrations/1657846587010-seed-grade";

import { CreateExchangeHistory1657846607010 } from "./migrations/1657846607010-create-exchange-history";

// Check typeORM documentation for more information.
const config: PostgresConnectionOptions = {
  name: "default",
  type: "postgres",
  entities: [
    UserEntity,
    OtpEntity,
    SettingsEntity,
    ContractManagerEntity,
    AccessControlEntity,
    AccessListEntity,
    VestingEntity,
    ContractEntity,
    TemplateEntity,
    StakingRulesEntity,
    StakingStakesEntity,
    StakingHistoryEntity,
    PageEntity,
    AssetEntity,
    AssetComponentEntity,
    ContractEntity,
    TemplateEntity,
    TokenEntity,
    BalanceEntity,
    ClaimEntity,
    LootboxEntity,
    CraftEntity,
    GradeEntity,
  ],
  // We are using migrations, synchronize should public-api set to false.
  synchronize: false,
  // Run migrations automatically,
  // you can disable this if you prefer running migration manually.
  // migrationsRun: process.env.NODE_ENV !== "production",
  migrationsRun: true,
  migrationsTableName: ns,
  migrationsTransactionMode: "each",
  namingStrategy: new SnakeNamingStrategy(),
  logging: process.env.NODE_ENV === "development",
  // Allow both start:prod and start:dev to use migrations
  // __dirname is either dist or server folder, meaning either
  // the compiled js in prod or the ts in dev.
  migrations: [
    createSchema(ns),
    createDomainUint256(),
    installExtensionUUID(),
    createLanguageEnum(ns),
    createTokenTypes(ns),
    CreateSettings1563804000010,
    SeedSettings1563804000020,
    CreateUser1563804000030,
    SeedUser1563804000040,
    CreateOtp1563804000060,

    CreateAsset1563804000100,

    CreateContract1563804000100,
    SeedContractErc20At1563804000120,
    SeedContractErc721At1563804000130,
    SeedContractErc998At1563804000140,
    SeedContractErc1155At1563804000150,
    SeedContractLootboxAt1563804000160,

    CreateTemplate1563804000200,
    SeedTemplateErc20At1563804000220,
    SeedTemplateErc721At1563804000230,
    SeedTemplateErc998At1563804000240,
    SeedTemplateErc1155At1563804000250,
    SeedTemplateLootboxAt1563804000230,

    CreateToken1563804000300,
    SeedTokenErc20At1563804000320,
    SeedTokenErc721At1563804000330,
    SeedTokenErc998At1563804000340,
    SeedTokenErc1155At1563804000350,

    CreateBalanceTable1563804000400,
    SeedBalanceErc20At1563804020420,
    SeedBalanceErc721At1563804020430,
    SeedBalanceErc998At1563804020440,
    SeedBalanceErc1155At1563804020450,

    CreateAssetComponent1563804001220,
    SeedAssetComponentsErc721At1563804001230,
    SeedAssetComponentsErc998At1563804001240,
    SeedAssetComponentsErc1155At1563804001250,

    CreateContractHistory1563804040330,
    CreateVesting1563804010210,
    SeedVesting1563804010220,
    CreateVestingHistory1563804010230,

    CreateContractManagerHistory1652682493386,
    CreateAccessControl1653616447230,
    CreateAccessControlHistory1653616447240,
    CreateAccessList1653616447330,
    SeedAccessList1653616447340,
    CreateAccessListHistory1653616447350,
    CreateContractManager1652962207600,
    SeedContractManager1652962207610,

    CreateClaimTable1563804040410,
    SeedClaimErc721At1563804040420,

    CreateLootbox1653616447910,
    SeedLootboxErc721At1653616447920,

    CreateCraft1653616448010,
    SeedCraftErc1155Erc1155At1653616448020,
    SeedCraftErc721Erc1155At1653616448030,

    CreateStakingRules1654751224200,
    SeedStakingRulesNativeAt1654751224210,
    SeedStakingRulesErc20At1654751224220,
    SeedStakingRulesErc721At1654751224230,
    SeedStakingRulesErc998At1654751224240,
    SeedStakingRulesErc1155At1654751224250,

    CreateStakes1654751224300,
    SeedStakes1654751224310,
    CreateStakingHistory1654751224400,

    CreatePage1655626535100,
    SeedPages1655626535110,

    CreateGrade1657846587000,
    SeedGrade1657846587010,
    CreateExchangeHistory1657846607010,
  ],
};

export default config;
