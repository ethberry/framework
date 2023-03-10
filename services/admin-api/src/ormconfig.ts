import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

import { EnabledLanguages, ns } from "@framework/constants";
import {
  createCountryEnum,
  createDomainUint256,
  createGenderEnum,
  createLanguageEnum,
  createSchema,
  createTokenTypesEnum,
  installExtensionUUID,
} from "@gemunion/nest-js-module-typeorm-postgres";

import { MerchantEntity } from "./infrastructure/merchant/merchant.entity";
import { SettingsEntity } from "./infrastructure/settings/settings.entity";
import { ContractManagerEntity } from "./blockchain/contract-manager/contract-manager.entity";
import { ContractEntity } from "./blockchain/hierarchy/contract/contract.entity";
import { TemplateEntity } from "./blockchain/hierarchy/template/template.entity";
import { TokenEntity } from "./blockchain/hierarchy/token/token.entity";
import { BalanceEntity } from "./blockchain/hierarchy/balance/balance.entity";
import { AssetEntity } from "./blockchain/exchange/asset/asset.entity";
import { AssetComponentEntity } from "./blockchain/exchange/asset/asset-component.entity";
import { AssetComponentHistoryEntity } from "./blockchain/exchange/asset/asset-component-history.entity";
import { AccessControlEntity } from "./blockchain/extensions/access-control/access-control.entity";
import { AccessListEntity } from "./blockchain/extensions/access-list/access-list.entity";
import { ClaimEntity } from "./blockchain/mechanics/claim/claim.entity";
import { MysteryBoxEntity } from "./blockchain/mechanics/mystery/box/box.entity";
import { StakingDepositEntity } from "./blockchain/mechanics/staking/deposit/deposit.entity";
import { StakingRulesEntity } from "./blockchain/mechanics/staking/rules/rules.entity";
import { CraftEntity } from "./blockchain/mechanics/craft/craft.entity";
import { PageEntity } from "./infrastructure/page/page.entity";
import { GradeEntity } from "./blockchain/mechanics/grade/grade.entity";
import { CompositionEntity } from "./blockchain/tokens/erc998/composition/composition.entity";
import { DropEntity } from "./blockchain/mechanics/drop/drop.entity";
import { LotteryTicketEntity } from "./blockchain/mechanics/lottery/ticket/ticket.entity";
import { LotteryRoundEntity } from "./blockchain/mechanics/lottery/round/round.entity";
import { PyramidRulesEntity } from "./blockchain/mechanics/pyramid/rules/rules.entity";
import { PyramidDepositEntity } from "./blockchain/mechanics/pyramid/deposit/deposit.entity";
import { EventHistoryEntity } from "./blockchain/event-history/event-history.entity";
import { WaitlistListEntity } from "./blockchain/mechanics/waitlist/list/list.entity";
import { WaitlistItemEntity } from "./blockchain/mechanics/waitlist/item/item.entity";
import { BreedEntity } from "./blockchain/mechanics/breed/breed.entity";
import { PayeesEntity } from "./blockchain/exchange/payees/payees.entity";
import { UserEntity } from "./infrastructure/user/user.entity";
import { OtpEntity } from "./infrastructure/otp/otp.entity";

// prettier-ignore
import {
  CreateSettings1563803000010,
  SeedSettings1563803000020,
  CreateMerchant1563803000110,
  SeedMerchant1563803000120,
  CreateUser1563803000130,
  SeedUser1563803000140,
  CreateAuth1563803000150,
  CreateOtp1563803000160,
  CreatePage1563803000210,
  SeedPages1563803000220,

  CreateAsset1563804000100,
  CreateContract1563804000100,
  SeedContractManagerAt1563804000101,
  SeedContractExchangeAt1563804000102,
  SeedContractLotteryAt1660436476100,
  SeedContractNativeAt1563804000110,
  SeedContractErc20At1563804000120,
  SeedContractErc20USDTAt1563804000121,
  SeedContractErc20WETHAt1563804000122,
  SeedContractErc20BUSDAt1563804000123,
  SeedContractErc721At1563804000130,
  SeedContractErc998At1563804000140,
  SeedContractErc1155At1563804000150,
  SeedContractMysteryAt1563804000160,
  SeedContractWrapperAt1563804000170,
  SeedContractLotteryAt1563804000180,
  SeedContractVestingAt1563804000190,

  CreateTemplate1563804000200,
  SeedTemplateNativeAt1563804000210,
  SeedTemplateErc20At1563804000220,
  SeedTemplateErc20USDTAt1563804000221,
  SeedTemplateErc20WETHAt1563804000222,
  SeedTemplateErc20BUSDAt1563804000223,
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
  SeedTokenErc20BUSDAt1563804000323,
  SeedTokenErc721At1563804000330,
  SeedTokenErc998At1563804000340,
  SeedTokenErc1155At1563804000350,
  SeedTokenMysteryAt1563804000360,
  SeedWrapperAt1563804000370,
  SeedTokenLotteryAt1563804000380,

  CreateBalance1563804000400,
  SeedBalanceExchangeAt1563804020402,
  SeedBalanceErc20At1563804020420,
  SeedBalanceErc721At1563804020430,
  SeedBalanceErc998At1563804020440,
  SeedBalanceErc1155At1563804020450,
  SeedBalanceErc721MysteryAt1563804020460,
  SeedBalanceErc721WrapperAt1563804020470,
  SeedBalanceErc721LotteryAt1563804020480,
  SeedBalanceVestingAt1563804000490,

  CreateAssetComponent1563804001220,
  SeedAssetComponentsErc721At1563804001230,
  SeedAssetComponentsErc998At1563804001240,
  SeedAssetComponentsErc1155At1563804001250,
  SeedAssetComponentsMysteryboxAt1563804001260,

  CreateContractHistory1563804040010,
  SeedEventHistoryExchangeErc721At1563804040230,
  SeedEventHistoryExchangeErc998At1563804040240,

  CreateClaim1653616447810,
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

  CreateAccessControl1653616447230,
  CreateAccessList1653616447330,
  SeedAccessList1653616447340,

  SeedContractStakingAt1654751224100,
  CreateStakingRules1654751224200,
  SeedStakingRulesErc721At1654751224230,
  SeedStakingRulesNativeAt1654751224210,
  SeedStakingRulesErc20At1654751224220,
  SeedStakingRulesErc998At1654751224240,
  SeedStakingRulesErc1155At1654751224250,
  SeedStakingRulesMysteryboxAt1654751224260,
  CreateStakingDeposit1654751224300,
  SeedStakingDepositNativeAt1654751224310,
  SeedStakingDepositErc20At1654751224320,
  SeedStakingDepositErc998At1654751224340,

  CreateGrade1657846587000,
  SeedGrade1657846587010,
  SeedAssetComponentGrade1657846587020,

  CreateAssetComponentHistory1657846609000,
  SeedAssetComponentHistoryErc721At1657846609030,

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

  CreateLotteryRoundAt1660436476100,
  SeedLotteryRoundAt1660436476120,
  CreateLotteryTicketAt1660436476130,
  SeedLotteryTicketsAt1660436476140,

  SeedContractPyramidAt1660436477100,
  CreatePyramidRules1660436477200,
  SeedPyramidRulesNativeAt1660436477210,
  SeedPyramidRulesErc20At1660436477220,

  CreatePyramidDeposit1660436477300,
  SeedPyramidDepositNativeAt1660436477310,
  SeedPyramidDepositErc20At1660436477320,

  SeedContractWaitlistAt1663047650100,
  CreateWaitlistList1663047650200,
  SeedWaitlistListAt1663047650210,
  CreateWaitlistItem1663047650300,
  SeedWaitlistItemAt1663047650310,

  CreateBreed1663047650400,
  SeedBreed1663047650401,

  CreateWalletPayees1663047650500,
  SeedExchangePayees1663047650510,
  SeedAssetComponentHistoryErc998At1657846609040,
  SeedContractChainLinkAt1563804000105,
  SeedPyramidPayees1663047650520
} from "./migrations";

// Check typeORM documentation for more information.
const config: PostgresConnectionOptions = {
  name: "default",
  type: "postgres",
  entities: [
    MerchantEntity,
    UserEntity,
    OtpEntity,
    SettingsEntity,
    ContractManagerEntity,
    AccessControlEntity,
    AccessListEntity,
    StakingRulesEntity,
    StakingDepositEntity,
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
    EventHistoryEntity,
    PyramidRulesEntity,
    PyramidDepositEntity,
    WaitlistItemEntity,
    WaitlistListEntity,
    BreedEntity,
    PayeesEntity,
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
    createLanguageEnum(ns, Object.keys(EnabledLanguages)),
    createTokenTypesEnum(ns),
    createCountryEnum(ns),
    createGenderEnum(ns),

    CreateSettings1563803000010,
    SeedSettings1563803000020,
    CreateMerchant1563803000110,
    SeedMerchant1563803000120,
    CreateUser1563803000130,
    SeedUser1563803000140,
    CreateAuth1563803000150,
    CreateOtp1563803000160,
    CreatePage1563803000210,
    SeedPages1563803000220,

    CreateAsset1563804000100,

    CreateContract1563804000100,
    SeedContractManagerAt1563804000101,
    SeedContractExchangeAt1563804000102,
    SeedContractLotteryAt1660436476100,
    SeedContractNativeAt1563804000110,
    SeedContractErc20At1563804000120,
    SeedContractErc20USDTAt1563804000121,
    SeedContractErc20WETHAt1563804000122,
    SeedContractErc20BUSDAt1563804000123,
    SeedContractErc721At1563804000130,
    SeedContractErc998At1563804000140,
    SeedContractErc1155At1563804000150,
    SeedContractMysteryAt1563804000160,
    SeedContractWrapperAt1563804000170,
    SeedContractLotteryAt1563804000180,
    SeedContractVestingAt1563804000190,

    CreateTemplate1563804000200,
    SeedTemplateNativeAt1563804000210,
    SeedTemplateErc20At1563804000220,
    SeedTemplateErc20USDTAt1563804000221,
    SeedTemplateErc20WETHAt1563804000222,
    SeedTemplateErc20BUSDAt1563804000223,
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
    SeedTokenErc20BUSDAt1563804000323,
    SeedTokenErc721At1563804000330,
    SeedTokenErc998At1563804000340,
    SeedTokenErc1155At1563804000350,
    SeedTokenMysteryAt1563804000360,
    SeedWrapperAt1563804000370,
    SeedTokenLotteryAt1563804000380,

    CreateBalance1563804000400,
    SeedBalanceExchangeAt1563804020402,
    SeedBalanceErc20At1563804020420,
    SeedBalanceErc721At1563804020430,
    SeedBalanceErc998At1563804020440,
    SeedBalanceErc1155At1563804020450,
    SeedBalanceErc721MysteryAt1563804020460,
    SeedBalanceErc721WrapperAt1563804020470,
    SeedBalanceErc721LotteryAt1563804020480,
    SeedBalanceVestingAt1563804000490,

    CreateAssetComponent1563804001220,
    SeedAssetComponentsErc721At1563804001230,
    SeedAssetComponentsErc998At1563804001240,
    SeedAssetComponentsErc1155At1563804001250,
    SeedAssetComponentsMysteryboxAt1563804001260,

    CreateContractHistory1563804040010,
    SeedEventHistoryExchangeErc721At1563804040230,
    SeedEventHistoryExchangeErc998At1563804040240,

    CreateAccessControl1653616447230,
    CreateAccessList1653616447330,
    SeedAccessList1653616447340,

    CreateClaim1653616447810,
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
    CreateStakingDeposit1654751224300,
    SeedStakingDepositNativeAt1654751224310,
    SeedStakingDepositErc20At1654751224320,
    SeedStakingDepositErc998At1654751224340,

    CreateGrade1657846587000,
    SeedGrade1657846587010,
    SeedAssetComponentGrade1657846587020,

    CreateAssetComponentHistory1657846609000,
    SeedAssetComponentHistoryErc721At1657846609030,
    SeedAssetComponentHistoryErc998At1657846609040,

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

    CreateLotteryRoundAt1660436476100,
    SeedLotteryRoundAt1660436476120,
    CreateLotteryTicketAt1660436476130,
    SeedLotteryTicketsAt1660436476140,

    SeedContractPyramidAt1660436477100,
    CreatePyramidRules1660436477200,
    SeedPyramidRulesNativeAt1660436477210,
    SeedPyramidRulesErc20At1660436477220,
    CreatePyramidDeposit1660436477300,
    SeedPyramidDepositNativeAt1660436477310,
    SeedPyramidDepositErc20At1660436477320,

    SeedContractWaitlistAt1663047650100,
    CreateWaitlistList1663047650200,
    SeedWaitlistListAt1663047650210,
    CreateWaitlistItem1663047650300,
    SeedWaitlistItemAt1663047650310,

    CreateBreed1663047650400,
    SeedBreed1663047650401,

    CreateWalletPayees1663047650500,
    SeedExchangePayees1663047650510,
    SeedPyramidPayees1663047650520,
    SeedContractChainLinkAt1563804000105,
  ],
};

export default config;
