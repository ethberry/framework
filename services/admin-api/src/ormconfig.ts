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
import { AssetComponentHistoryEntity } from "./blockchain/mechanics/asset/asset-component-history.entity";
import { AccessControlEntity } from "./blockchain/access-control/access-control.entity";
import { AccessListEntity } from "./blockchain/access-list/access-list.entity";
import { ClaimEntity } from "./blockchain/mechanics/claim/claim.entity";
import { MysteryBoxEntity } from "./blockchain/mechanics/mystery/box/box.entity";
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
import { ExchangeHistoryEntity } from "./blockchain/mechanics/exchange/history/exchange-history.entity";
import { WhitelistEntity } from "./blockchain/mechanics/whitelist/whitelist.entity";

import { CreateUser1563804000030 } from "./migrations/1563804000030-create-user";
import { SeedUser1563804000040 } from "./migrations/1563804000040-seed-user";
import { CreateOtp1563804000060 } from "./migrations/1563804000060-create-otp";

import { CreateAsset1563804000100 } from "./migrations/1563804000100-create-asset";

import { CreateContract1563804000100 } from "./migrations/1563804000100-create-contract";
import { SeedContractManagerAt1563804000101 } from "./migrations/1563804000101-create-contract-manager";
import { SeedContractExchangeAt1563804000102 } from "./migrations/1563804000102-seed-contract-exchange";
import { SeedContractNativeAt1563804000110 } from "./migrations/1563804000110-seed-contract-native";
import { SeedContractErc20At1563804000120 } from "./migrations/1563804000120-seed-contract-erc20";
import { SeedContractErc20USDTAt1563804000121 } from "./migrations/1563804000121-seed-contract-erc20-usdt";
import { SeedContractErc20WETHAt1563804000122 } from "./migrations/1563804000122-seed-contract-erc20-weth";
import { SeedContractErc721At1563804000130 } from "./migrations/1563804000130-seed-contract-erc721";
import { SeedContractErc998At1563804000140 } from "./migrations/1563804000140-seed-contract-erc998";
import { SeedContractErc1155At1563804000150 } from "./migrations/1563804000150-seed-contract-erc1155";
import { SeedContractMysteryAt1563804000160 } from "./migrations/1563804000160-seed-contract-mystery";
import { SeedContractWrapperAt1563804000170 } from "./migrations/1563804000170-seed-contract-wrapper";
import { SeedContractLotteryAt1563804000180 } from "./migrations/1563804000180-seed-contract-lottery";

import { CreateTemplate1563804000200 } from "./migrations/1563804000200-create-template";
import { SeedTemplateNativeAt1563804000210 } from "./migrations/1563804000210-seed-template-native";
import { SeedTemplateErc20At1563804000220 } from "./migrations/1563804000220-seed-template-erc20";
import { SeedTemplateErc20USDTAt1563804000221 } from "./migrations/1563804000221-seed-template-erc20-usdt";
import { SeedTemplateErc20WETHAt1563804000222 } from "./migrations/1563804000222-seed-template-erc20-weth";
import { SeedTemplateErc721At1563804000230 } from "./migrations/1563804000230-seed-template-erc721";
import { SeedTemplateErc998At1563804000240 } from "./migrations/1563804000240-seed-template-erc998";
import { SeedTemplateErc1155At1563804000250 } from "./migrations/1563804000250-seed-template-erc1155";
import { SeedTemplateMysteryAt1563804000260 } from "./migrations/1563804000260-seed-template-mystery";
import { SeedTemplateWrapperAt1563804000270 } from "./migrations/1563804000270-seed-template-wrapper";
import { SeedTemplateLotteryAt1563804000280 } from "./migrations/1563804000280-seed-template-lottery";

import { CreateToken1563804000300 } from "./migrations/1563804000300-create-token";
import { SeedTokenNativeAt1563804000310 } from "./migrations/1563804000310-seed-token-native";
import { SeedTokenErc20At1563804000320 } from "./migrations/1563804000320-seed-token-erc20";
import { SeedTokenErc20USDTAt1563804000321 } from "./migrations/1563804000321-seed-token-erc20-usdt";
import { SeedTokenErc20WETHAt1563804000322 } from "./migrations/1563804000322-seed-token-erc20-weth";
import { SeedTokenErc721At1563804000330 } from "./migrations/1563804000330-seed-token-erc721";
import { SeedTokenErc998At1563804000340 } from "./migrations/1563804000340-seed-token-erc998";
import { SeedTokenErc1155At1563804000350 } from "./migrations/1563804000350-seed-token-erc1155";
import { SeedTokenMysteryAt1563804000360 } from "./migrations/1563804000360-seed-token-mystery";
import { SeedTokenWrapperAt1563804000370 } from "./migrations/1563804000370-seed-token-wrapper";
import { SeedTokenLotteryAt1563804000380 } from "./migrations/1563804000380-seed-token-lottery";

import { CreateBalanceTable1563804000400 } from "./migrations/1563804000400-create-balance";
import { SeedBalanceErc20At1563804020420 } from "./migrations/1563804000420-seed-balance-erc20";
import { SeedBalanceErc721At1563804020430 } from "./migrations/1563804000430-seed-balance-erc721";
import { SeedBalanceErc998At1563804020440 } from "./migrations/1563804000440-seed-balance-erc998";
import { SeedBalanceErc1155At1563804020450 } from "./migrations/1563804000450-seed-balance-erc1155";
import { SeedBalanceErcMysteryAt1563804020460 } from "./migrations/1563804000460-seed-balance-mysterybox";
import { SeedBalanceErcWrapperAt1563804020470 } from "./migrations/1563804000470-seed-balance-wrapper";
import { SeedBalanceLotteryAt1563804020480 } from "./migrations/1563804000480-seed-balance-lottery";

import { CreateAssetComponent1563804001220 } from "./migrations/1563804001220-create-asset-component";
import { SeedAssetComponentsErc721At1563804001230 } from "./migrations/1563804001230-seed-asset-component-erc721";
import { SeedAssetComponentsErc998At1563804001240 } from "./migrations/1563804001240-seed-asset-component-erc998";
import { SeedAssetComponentsErc1155At1563804001250 } from "./migrations/1563804001250-seed-asset-component-erc1155";
import { SeedAssetComponentsMysteryboxAt1563804001260 } from "./migrations/1563804001260-seed-asset-component-mysterybox";

import { CreateContractHistory1563804040010 } from "./migrations/1563804040010-create-contract-history";
import { CreateContractManagerHistory1563804040110 } from "./migrations/1563804040110-create-contract-manager-history";
import { CreateExchangeHistory1563804040210 } from "./migrations/1563804040210-create-exchange-history";
import { SeedExchangeHistory1563804040220 } from "./migrations/1563804040220-seed-exchange-history";

import { CreateVesting1653616433210 } from "./migrations/1653616433210-create-vesting";
import { SeedVesting1653616433210 } from "./migrations/1653616433220-seed-vesting";
import { CreateVestingHistory1563804010230 } from "./migrations/1653616433230-create-vesting-history";

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

import { CreateAccessControl1653616447230 } from "./migrations/1653616447230-create-access-control";
import { CreateAccessControlHistory1653616447240 } from "./migrations/1653616447240-create-access-control-history";
import { CreateAccessList1653616447330 } from "./migrations/1653616447330-create-access-list";
import { SeedAccessList1653616447340 } from "./migrations/1653616447340-seed-access-list";
import { CreateAccessListHistory1653616447350 } from "./migrations/1653616447350-create-access-list-history";
import { CreateSettings1563804000010 } from "./migrations/1563804000010-create-settings";
import { SeedSettings1563804000020 } from "./migrations/1563804000020-seed-settings";

import { SeedContractStakingAt1654751224100 } from "./migrations/1654751224100-seed-contract-staking";
import { CreateStakingRules1654751224200 } from "./migrations/1654751224200-create-staking-rules";
import { SeedStakingRulesErc721At1654751224230 } from "./migrations/1654751224230-seed-staking-rules-erc721";
import { SeedStakingRulesNativeAt1654751224210 } from "./migrations/1654751224210-seed-staking-rules-native";
import { SeedStakingRulesErc20At1654751224220 } from "./migrations/1654751224220-seed-staking-rules-erc20";
import { SeedStakingRulesErc998At1654751224240 } from "./migrations/1654751224240-seed-staking-rules-erc998";
import { SeedStakingRulesErc1155At1654751224250 } from "./migrations/1654751224250-seed-staking-rules-erc1155";
import { SeedStakingRulesMysteryboxAt1654751224260 } from "./migrations/1654751224260-seed-staking-rules-mysterybox";
import { CreateStakes1654751224300 } from "./migrations/1654751224300-create-stakes";
import { SeedStakesNativeAt1654751224310 } from "./migrations/1654751224310-seed-stakes-native";
import { SeedStakesErc20At1654751224320 } from "./migrations/1654751224320-seed-stakes-erc20";
import { SeedStakesErc998At1654751224340 } from "./migrations/1654751224340-seed-stakes-erc998";
import { CreateStakingHistory1654751224400 } from "./migrations/1654751224400-create-staking-history";

import { CreatePage1655626535100 } from "./migrations/1655626535100-create-page";
import { SeedPages1655626535110 } from "./migrations/1655626535110-seed-pages";

import { CreateGrade1657846587000 } from "./migrations/1657846587000-create-grade";
import { SeedGrade1657846587010 } from "./migrations/1657846587010-seed-grade";
import { SeedAssetComponentGrade1657846587020 } from "./migrations/1657846587020-seed-asset-component-grade";

import { CreateAssetComponentHistory1657846609000 } from "./migrations/1657846609000-create-asset-component-history";
import { SeedAssetComponentHistory1657846609010 } from "./migrations/1657846609010-seed-asset-component-history";

import { CreateCompositionAt1658980520000 } from "./migrations/1658980520000-create-composition";
import { SeedCompositionAt1658980520010 } from "./migrations/1658980520010-seed-composition";
import { CreateOwnershipAt1658980520100 } from "./migrations/1658980520100-create-ownership";
import { SeedOwnershipAt1658980520110 } from "./migrations/1658980520110-seed-ownership";

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
import { CreatePyramidRules1660436477100 } from "./migrations/1660436477100-create-pyramid-rules";
import { SeedPyramidRules1660436477150 } from "./migrations/1660436477150-seed-pyramid-rules";
import { CreatePyramidStakes1660436477200 } from "./migrations/1660436477200-create-pyramid-stakes";
import { CreatePyramidStakingHistory1660436477250 } from "./migrations/1660436477250-create-pyramid-staking-history";
import { PyramidRulesEntity } from "./blockchain/mechanics/pyramid/rules/rules.entity";
import { PyramidStakesEntity } from "./blockchain/mechanics/pyramid/stakes/stakes.entity";

import { CreateWhitelistTable1663047650500 } from "./migrations/1663047650500-create-whitelist";

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
    AssetComponentHistoryEntity,
    ContractEntity,
    TemplateEntity,
    TokenEntity,
    BalanceEntity,
    ClaimEntity,
    MysteryBoxEntity,
    CraftEntity,
    GradeEntity,
    CompositionEntity,
    DropEntity,
    LotteryRoundEntity,
    LotteryTicketEntity,
    ExchangeHistoryEntity,
    PyramidRulesEntity,
    PyramidStakesEntity,
    WhitelistEntity,
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
    SeedContractManagerAt1563804000101,
    SeedContractExchangeAt1563804000102,
    SeedContractNativeAt1563804000110,
    SeedContractErc20At1563804000120,
    SeedContractErc20USDTAt1563804000121,
    SeedContractErc20WETHAt1563804000122,
    SeedContractErc721At1563804000130,
    SeedContractErc998At1563804000140,
    SeedContractErc1155At1563804000150,
    SeedContractMysteryAt1563804000160,
    SeedContractWrapperAt1563804000170,
    SeedContractLotteryAt1563804000180,

    CreateTemplate1563804000200,
    SeedTemplateNativeAt1563804000210,
    SeedTemplateErc20At1563804000220,
    SeedTemplateErc20USDTAt1563804000221,
    SeedTemplateErc20WETHAt1563804000222,
    SeedTemplateErc721At1563804000230,
    SeedTemplateErc998At1563804000240,
    SeedTemplateErc1155At1563804000250,
    SeedTemplateMysteryAt1563804000260,
    SeedTemplateWrapperAt1563804000270,
    SeedTemplateLotteryAt1563804000280,

    CreateToken1563804000300,
    SeedTokenNativeAt1563804000310,
    SeedTokenErc20At1563804000320,
    SeedTokenErc20USDTAt1563804000321,
    SeedTokenErc20WETHAt1563804000322,
    SeedTokenErc721At1563804000330,
    SeedTokenErc998At1563804000340,
    SeedTokenErc1155At1563804000350,
    SeedTokenMysteryAt1563804000360,
    SeedTokenWrapperAt1563804000370,
    SeedTokenLotteryAt1563804000380,

    CreateBalanceTable1563804000400,
    SeedBalanceErc20At1563804020420,
    SeedBalanceErc721At1563804020430,
    SeedBalanceErc998At1563804020440,
    SeedBalanceErc1155At1563804020450,
    SeedBalanceErcMysteryAt1563804020460,
    SeedBalanceErcWrapperAt1563804020470,
    SeedBalanceLotteryAt1563804020480,

    CreateAssetComponent1563804001220,
    SeedAssetComponentsErc721At1563804001230,
    SeedAssetComponentsErc998At1563804001240,
    SeedAssetComponentsErc1155At1563804001250,
    SeedAssetComponentsMysteryboxAt1563804001260,

    CreateContractHistory1563804040010,
    CreateContractManagerHistory1563804040110,
    CreateExchangeHistory1563804040210,
    SeedExchangeHistory1563804040220,

    CreateVesting1653616433210,
    SeedVesting1653616433210,
    CreateVestingHistory1563804010230,

    CreateAccessControl1653616447230,
    CreateAccessControlHistory1653616447240,
    CreateAccessList1653616447330,
    SeedAccessList1653616447340,
    CreateAccessListHistory1653616447350,

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

    SeedContractStakingAt1654751224100,
    CreateStakingRules1654751224200,
    SeedStakingRulesNativeAt1654751224210,
    SeedStakingRulesErc20At1654751224220,
    SeedStakingRulesErc721At1654751224230,
    SeedStakingRulesErc998At1654751224240,
    SeedStakingRulesErc1155At1654751224250,
    SeedStakingRulesMysteryboxAt1654751224260,
    CreateStakes1654751224300,
    SeedStakesNativeAt1654751224310,
    SeedStakesErc20At1654751224320,
    SeedStakesErc998At1654751224340,
    CreateStakingHistory1654751224400,

    CreatePage1655626535100,
    SeedPages1655626535110,

    CreateGrade1657846587000,
    SeedGrade1657846587010,
    SeedAssetComponentGrade1657846587020,

    CreateAssetComponentHistory1657846609000,
    SeedAssetComponentHistory1657846609010,

    CreateCompositionAt1658980520000,
    SeedCompositionAt1658980520010,
    CreateOwnershipAt1658980520100,
    SeedOwnershipAt1658980520110,

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

    CreateWhitelistTable1663047650500,

    CreatePyramidRules1660436477100,
    SeedPyramidRules1660436477150,
    CreatePyramidStakes1660436477200,
    CreatePyramidStakingHistory1660436477250,
  ],
};

export default config;
