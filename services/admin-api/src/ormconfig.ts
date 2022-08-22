import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

import { ns } from "@framework/constants";
import {
  createDomainUint256,
  createLanguageEnum,
  createSchema,
  createTokenTypes,
  installExtensionUUID,
} from "@gemunion/nest-js-module-typeorm-postgres";

import { UserEntity } from "./user/user.entity";
import { OtpEntity } from "./otp/otp.entity";
import { SettingsEntity } from "./settings/settings.entity";
import { ContractManagerEntity } from "./blockchain/contract-manager/contract-manager.entity";
import { ContractEntity } from "./blockchain/hierarchy/contract/contract.entity";
import { TemplateEntity } from "./blockchain/hierarchy/template/template.entity";
import { TokenEntity } from "./blockchain/hierarchy/token/token.entity";
import { BalanceEntity } from "./blockchain/hierarchy/balance/balance.entity";
import { AssetEntity } from "./blockchain/mechanics/asset/asset.entity";
import { AssetComponentEntity } from "./blockchain/mechanics/asset/asset-component.entity";
import { AccessControlEntity } from "./blockchain/access-control/access-control.entity";
import { AccessListEntity } from "./blockchain/access-list/access-list.entity";
import { ClaimEntity } from "./blockchain/mechanics/claim/claim.entity";
import { MysteryboxBoxEntity } from "./blockchain/mechanics/mysterybox/box/box.entity";
import { StakingStakesEntity } from "./blockchain/mechanics/staking/stakes/stakes.entity";
import { StakingRulesEntity } from "./blockchain/mechanics/staking/rules/rules.entity";
import { CraftEntity } from "./blockchain/mechanics/craft/craft.entity";
import { PageEntity } from "./page/page.entity";
import { GradeEntity } from "./blockchain/mechanics/grade/grade.entity";
import { CompositionEntity } from "./blockchain/tokens/erc998/composition/composition.entity";
import { DropEntity } from "./blockchain/mechanics/drop/drop.entity";
import { VestingEntity } from "./blockchain/mechanics/vesting/vesting.entity";
import { LotteryTicketEntity } from "./blockchain/mechanics/lottery/ticket/ticket.entity";
import { LotteryRoundEntity } from "./blockchain/mechanics/lottery/round/round.entity";

import { CreateUser1563804000030 } from "./migrations/1563804000030-create-user";
import { SeedUser1563804000040 } from "./migrations/1563804000040-seed-user";
import { CreateOtp1563804000060 } from "./migrations/1563804000060-create-otp";

import { CreateAsset1563804000100 } from "./migrations/1563804000100-create-asset";

import { CreateContract1563804000100 } from "./migrations/1563804000100-create-contract";
import { SeedContractNativeAt1563804000110 } from "./migrations/1563804000110-seed-contract-native";
import { SeedContractErc20At1563804000120 } from "./migrations/1563804000120-seed-contract-erc20";
import { SeedContractErc721At1563804000130 } from "./migrations/1563804000130-seed-contract-erc721";
import { SeedContractErc998At1563804000140 } from "./migrations/1563804000140-seed-contract-erc998";
import { SeedContractErc1155At1563804000150 } from "./migrations/1563804000150-seed-contract-erc1155";
import { SeedContractMysteryboxAt1563804000160 } from "./migrations/1563804000160-seed-contract-mysterybox";
import { SeedContractLotteryAt1563804000170 } from "./migrations/1563804000170-seed-contract-lottery";

import { CreateTemplate1563804000200 } from "./migrations/1563804000200-create-template";
import { SeedTemplateNativeAt1563804000210 } from "./migrations/1563804000210-seed-template-native";
import { SeedTemplateErc20At1563804000220 } from "./migrations/1563804000220-seed-template-erc20";
import { SeedTemplateErc721At1563804000230 } from "./migrations/1563804000230-seed-template-erc721";
import { SeedTemplateErc998At1563804000240 } from "./migrations/1563804000240-seed-template-erc998";
import { SeedTemplateErc1155At1563804000250 } from "./migrations/1563804000250-seed-template-erc1155";
import { SeedTemplateMysteryboxAt1563804000260 } from "./migrations/1563804000260-seed-template-mysterybox";
import { SeedTemplateLotteryAt1563804000270 } from "./migrations/1563804000270-seed-template-lottery";

import { CreateToken1563804000300 } from "./migrations/1563804000300-create-token";
import { SeedTokenNativeAt1563804000310 } from "./migrations/1563804000310-seed-token-native";
import { SeedTokenErc20At1563804000320 } from "./migrations/1563804000320-seed-token-erc20";
import { SeedTokenErc721At1563804000330 } from "./migrations/1563804000330-seed-token-erc721";
import { SeedTokenErc998At1563804000340 } from "./migrations/1563804000340-seed-token-erc998";
import { SeedTokenErc1155At1563804000350 } from "./migrations/1563804000350-seed-token-erc1155";
import { SeedTokenMysteryboxAt1563804000360 } from "./migrations/1563804000360-seed-token-mysterybox";
import { SeedTokenLotteryAt1563804000370 } from "./migrations/1563804000370-seed-token-lottery";

import { CreateBalanceTable1563804000400 } from "./migrations/1563804000400-create-balance";
import { SeedBalanceErc20At1563804020420 } from "./migrations/1563804000420-seed-balance-erc20";
import { SeedBalanceErc721At1563804020430 } from "./migrations/1563804000430-seed-balance-erc721";
import { SeedBalanceErc998At1563804020440 } from "./migrations/1563804000440-seed-balance-erc998";
import { SeedBalanceErc1155At1563804020450 } from "./migrations/1563804000450-seed-balance-erc1155";
import { SeedBalanceErcMysteryboxAt1563804020460 } from "./migrations/1563804000460-seed-balance-mysterybox";
import { SeedBalanceLotteryAt1563804020470 } from "./migrations/1563804000470-seed-balance-lottery";

import { CreateAssetComponent1563804001220 } from "./migrations/1563804001220-create-asset-component";
import { SeedAssetComponentsErc721At1563804001230 } from "./migrations/1563804001230-seed-asset-component-erc721";
import { SeedAssetComponentsErc998At1563804001240 } from "./migrations/1563804001240-seed-asset-component-erc998";
import { SeedAssetComponentsErc1155At1563804001250 } from "./migrations/1563804001250-seed-asset-component-erc1155";
import { SeedAssetComponentsMysteryboxAt1563804001260 } from "./migrations/1563804001260-seed-asset-component-mysterybox";

import { CreateContractHistory1563804040330 } from "./migrations/1563804040330-create-contract-history";
import { CreateVesting1563804010210 } from "./migrations/1563804010210-create-vesting";
import { SeedVesting1563804010220 } from "./migrations/1563804010220-seed-vesting";
import { CreateVestingHistory1563804010230 } from "./migrations/1563804010230-create-vesting-history";

import { CreateClaimTable1653616447810 } from "./migrations/1653616447810-create-claim";
import { SeedClaimErc721At1653616447830 } from "./migrations/1653616447830-seed-claim-erc721";
import { SeedClaimErc998At1653616447840 } from "./migrations/1653616447840-seed-claim-erc998";
import { SeedClaimErc1155At1653616447850 } from "./migrations/1653616447850-seed-claim-erc1155";
import { SeedClaimMysteryboxAt1653616447860 } from "./migrations/1653616447860-seed-claim-mysterybox";
import { SeedClaimMixedAt1653616447870 } from "./migrations/1653616447870-seed-claim-mixed";

import { CreateMysterybox1653616447910 } from "./migrations/1653616447910-create-mysterybox";
import { SeedMysteryboxErc721At1653616447930 } from "./migrations/1653616447930-seed-mysterybox-erc721";
import { SeedMysteryboxErc998At1653616447940 } from "./migrations/1653616447940-seed-mysterybox-erc998";
import { SeedMysteryboxErc1155At1653616447950 } from "./migrations/1653616447950-seed-mysterybox-erc1155";
import { SeedMysteryboxMixedAt1653616447970 } from "./migrations/1653616447970-seed-mysterybox-mixed";

import { CreateCraft1653616448010 } from "./migrations/1653616448010-create-craft";
import { SeedCraftErc1155Erc1155At1653616448020 } from "./migrations/1653616448020-seed-craft-erc1155-erc1155";
import { SeedCraftErc721Erc1155At1653616448030 } from "./migrations/1653616448030-seed-craft-erc721-erc1155-recipe";

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
import { SeedStakesNativeAt1654751224310 } from "./migrations/1654751224310-seed-stakes-native";
import { SeedStakesErc20At1654751224320 } from "./migrations/1654751224320-seed-stakes-erc20";
import { SeedStakesErc998At1654751224340 } from "./migrations/1654751224340-seed-stakes-erc998";
import { CreateStakingHistory1654751224400 } from "./migrations/1654751224400-create-staking-history";

import { CreatePage1655626535100 } from "./migrations/1655626535100-create-page";
import { SeedPages1655626535110 } from "./migrations/1655626535110-seed-pages";
import { CreateGrade1657846587000 } from "./migrations/1657846587000-create-grade";
import { SeedGrade1657846587010 } from "./migrations/1657846587010-seed-grade";

import { CreateExchangeHistory1657846607010 } from "./migrations/1657846607010-create-exchange-history";

import { CreateCompositionAt1658980520000 } from "./migrations/1658980520000-create-composition";
import { SeedCompositionAt1658980520010 } from "./migrations/1658980520010-seed-composition";

import { CreateDropAt1658980521000 } from "./migrations/1658980521000-create-drop";
import { SeedDropErc721At1658980521030 } from "./migrations/1658980521030-seed-drop-erc721";
import { SeedDropErc998At1658980521040 } from "./migrations/1658980521040-seed-drop-erc998";
import { SeedDropErc1155At1658980521050 } from "./migrations/1658980521050-seed-drop-erc1155";
import { SeedDropErcMysteryboxAt1658980521050 } from "./migrations/1658980521060-seed-drop-mysterybox";

import { CreateReferralRewardAt1660103709900 } from "./migrations/1660103709900-create-referral-reward";
import { SeedReferralRewardAt1660103709910 } from "./migrations/1660103709910-seed-referral-reward";
import { CreateReferralHistoryAt1660103709950 } from "./migrations/1660103709950-create-referral-history";

import { CreateLotteryRoundAt1660436477000 } from "./migrations/1660436477000-create-lottery-round";
import { SeedLotteryRoundAt1660436477010 } from "./migrations/1660436477010-seed-lottery-round";
import { CreateLotteryTicketAt1660436477020 } from "./migrations/1660436477020-create-lottery-tickets";
import { SeedLotteryTicketsAt1660436477030 } from "./migrations/1660436477030-seed-lottery-tickets";
import { CreateLotteryHistoryAt1660436477040 } from "./migrations/1660436477040-create-lottery-history";
import { SeedContractManager1660436477050 } from "./migrations/1660436477050-seed-contract-manager";

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
    PageEntity,
    AssetEntity,
    AssetComponentEntity,
    ContractEntity,
    TemplateEntity,
    TokenEntity,
    BalanceEntity,
    ClaimEntity,
    MysteryboxBoxEntity,
    CraftEntity,
    GradeEntity,
    CompositionEntity,
    DropEntity,
    LotteryRoundEntity,
    LotteryTicketEntity,
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
    SeedContractNativeAt1563804000110,
    SeedContractErc20At1563804000120,
    SeedContractErc721At1563804000130,
    SeedContractErc998At1563804000140,
    SeedContractErc1155At1563804000150,
    SeedContractMysteryboxAt1563804000160,
    SeedContractLotteryAt1563804000170,

    CreateTemplate1563804000200,
    SeedTemplateNativeAt1563804000210,
    SeedTemplateErc20At1563804000220,
    SeedTemplateErc721At1563804000230,
    SeedTemplateErc998At1563804000240,
    SeedTemplateErc1155At1563804000250,
    SeedTemplateMysteryboxAt1563804000260,
    SeedTemplateLotteryAt1563804000270,

    CreateToken1563804000300,
    SeedTokenNativeAt1563804000310,
    SeedTokenErc20At1563804000320,
    SeedTokenErc721At1563804000330,
    SeedTokenErc998At1563804000340,
    SeedTokenErc1155At1563804000350,
    SeedTokenMysteryboxAt1563804000360,
    SeedTokenLotteryAt1563804000370,

    CreateBalanceTable1563804000400,
    SeedBalanceErc20At1563804020420,
    SeedBalanceErc721At1563804020430,
    SeedBalanceErc998At1563804020440,
    SeedBalanceErc1155At1563804020450,
    SeedBalanceErcMysteryboxAt1563804020460,
    SeedBalanceLotteryAt1563804020470,

    CreateAssetComponent1563804001220,
    SeedAssetComponentsErc721At1563804001230,
    SeedAssetComponentsErc998At1563804001240,
    SeedAssetComponentsErc1155At1563804001250,
    SeedAssetComponentsMysteryboxAt1563804001260,

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

    CreateClaimTable1653616447810,
    SeedClaimErc721At1653616447830,
    SeedClaimErc998At1653616447840,
    SeedClaimErc1155At1653616447850,
    SeedClaimMysteryboxAt1653616447860,
    SeedClaimMixedAt1653616447870,

    CreateMysterybox1653616447910,
    SeedMysteryboxErc721At1653616447930,
    SeedMysteryboxErc998At1653616447940,
    SeedMysteryboxErc1155At1653616447950,
    SeedMysteryboxMixedAt1653616447970,

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
    SeedStakesNativeAt1654751224310,
    SeedStakesErc20At1654751224320,
    SeedStakesErc998At1654751224340,
    CreateStakingHistory1654751224400,

    CreatePage1655626535100,
    SeedPages1655626535110,

    CreateGrade1657846587000,
    SeedGrade1657846587010,

    CreateExchangeHistory1657846607010,

    CreateCompositionAt1658980520000,
    SeedCompositionAt1658980520010,

    CreateDropAt1658980521000,
    SeedDropErc721At1658980521030,
    SeedDropErc998At1658980521040,
    SeedDropErc1155At1658980521050,
    SeedDropErcMysteryboxAt1658980521050,

    CreateReferralRewardAt1660103709900,
    SeedReferralRewardAt1660103709910,
    CreateReferralHistoryAt1660103709950,

    CreateLotteryRoundAt1660436477000,
    SeedLotteryRoundAt1660436477010,
    CreateLotteryTicketAt1660436477020,
    SeedLotteryTicketsAt1660436477030,
    CreateLotteryHistoryAt1660436477040,
    SeedContractManager1660436477050,
  ],
};

export default config;
