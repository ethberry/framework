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
import { BusinessType, NodeEnv } from "@framework/types";

/* infrastructure */
import { MerchantEntity } from "./infrastructure/merchant/merchant.entity";
import { SettingsEntity } from "./infrastructure/settings/settings.entity";
import { NetworkEntity } from "./infrastructure/network/network.entity";
import { UserEntity } from "./infrastructure/user/user.entity";
import { OtpEntity } from "./infrastructure/otp/otp.entity";
import { RatePlanEntity } from "./infrastructure/rate-plan/rate-plan.entity";
/* blockchain */
// hierarchy
import { ContractEntity } from "./blockchain/hierarchy/contract/contract.entity";
import { TemplateEntity } from "./blockchain/hierarchy/template/template.entity";
import { TokenEntity } from "./blockchain/hierarchy/token/token.entity";
import { BalanceEntity } from "./blockchain/hierarchy/balance/balance.entity";
import { CompositionEntity } from "./blockchain/tokens/erc998/composition/composition.entity";
// contract-manager
import { ContractManagerEntity } from "./blockchain/contract-manager/contract-manager.entity";
// exchange
import { AssetEntity } from "./blockchain/exchange/asset/asset.entity";
import { AssetComponentEntity } from "./blockchain/exchange/asset/asset-component.entity";
import { AssetComponentHistoryEntity } from "./blockchain/exchange/asset/asset-component-history.entity";
import { PayeesEntity } from "./blockchain/exchange/payees/payees.entity";
// integrations
import { ChainLinkSubscriptionEntity } from "./blockchain/integrations/chain-link/subscription/subscription.entity";
// extensions
import { AccessControlEntity } from "./blockchain/extensions/access-control/access-control.entity";
import { AccessListEntity } from "./blockchain/extensions/access-list/access-list.entity";
// mechanics
import { ClaimEntity } from "./blockchain/mechanics/claim/claim.entity";
import { MysteryBoxEntity } from "./blockchain/mechanics/mystery/box/box.entity";
import { StakingDepositEntity } from "./blockchain/mechanics/staking/deposit/deposit.entity";
import { StakingRulesEntity } from "./blockchain/mechanics/staking/rules/rules.entity";
import { StakingPenaltyEntity } from "./blockchain/mechanics/staking/penalty/penalty.entity";
import { CraftEntity } from "./blockchain/mechanics/recipes/craft/craft.entity";
import { DismantleEntity } from "./blockchain/mechanics/recipes/dismantle/dismantle.entity";
import { MergeEntity } from "./blockchain/mechanics/recipes/merge/merge.entity";
import { GradeEntity } from "./blockchain/mechanics/grade/grade.entity";
import { AssetPromoEntity } from "./blockchain/mechanics/promo/promo.entity";
/* lottery */
import { LotteryRoundEntity } from "./blockchain/mechanics/lottery/round/round.entity";
import { LotteryRoundAggregationEntity } from "./blockchain/mechanics/lottery/round/round.aggregation.entity";
/* raffle */
import { RaffleRoundEntity } from "./blockchain/mechanics/raffle/round/round.entity";
/* ponzi */
import { PonziRulesEntity } from "./blockchain/mechanics/ponzi/rules/rules.entity";
import { PonziDepositEntity } from "./blockchain/mechanics/ponzi/deposit/deposit.entity";
import { EventHistoryEntity } from "./blockchain/event-history/event-history.entity";
import { WaitListListEntity } from "./blockchain/mechanics/wait-list/list/list.entity";
import { WaitListItemEntity } from "./blockchain/mechanics/wait-list/item/item.entity";
import { BreedEntity } from "./blockchain/mechanics/breed/breed.entity";
import { RentEntity } from "./blockchain/mechanics/rent/rent.entity";
/* ecommerce */
import { AddressEntity } from "./ecommerce/address/address.entity";
import { CategoryEntity } from "./ecommerce/category/category.entity";
import { CustomParameterEntity } from "./ecommerce/custom-parameter/custom-parameter.entity";
import { OrderEntity } from "./ecommerce/order/order.entity";
import { OrderItemEntity } from "./ecommerce/order-item/order-item.entity";
import { ParameterEntity } from "./ecommerce/parameter/parameter.entity";
import { PhotoEntity } from "./ecommerce/photo/photo.entity";
import { ProductEntity } from "./ecommerce/product/product.entity";
import { ProductItemEntity } from "./ecommerce/product-item/product-item.entity";
import { ProductItemParameterEntity } from "./ecommerce/product-item-parameter/product-item-parameter.entity";
import { ProductPromoEntity } from "./ecommerce/promo/promo.entity";
import { StockEntity } from "./ecommerce/stock/stock.entity";
/* achievements */
import { AchievementItemEntity } from "./achievements/item/item.entity";
import { AchievementLevelEntity } from "./achievements/level/level.entity";
import { AchievementRuleEntity } from "./achievements/rule/rule.entity";
import { AchievementRedemptionEntity } from "./achievements/redemption/redemption.entity";
/* referral */
import { ReferralRewardEntity } from "./blockchain/mechanics/referral/reward/referral.reward.entity";
import { ReferralProgramEntity } from "./blockchain/mechanics/referral/program/referral.program.entity";

/* migrations */
import {
  AlterMerchant1687519905550,
  CreateAccessControl1653616447200,
  CreateAccessList1653616447300,
  CreateAchievementItem1681273013050,
  CreateAchievementLevel1681273013030,
  CreateAchievementRedemption1681273013070,
  CreateAchievementRule1681273013010,
  CreateAddress1683724061900,
  CreateAsset1563804000100,
  CreateAssetComponent1563804001220,
  CreateAssetPromoAt1658980521000,
  CreateAuth1563803000150,
  CreateBalance1563804000400,
  CreateBreed1663047650400,
  CreateCart1683724062200,
  CreateCartItem1683724062210,
  CreateCategory1683724061300,
  CreateChainLinkSubscriptions1563803000121,
  CreateClaim1653616447810,
  CreateCompositionAt1658980520000,
  CreateContract1563804000100,
  CreateCraft1653616448000,
  CreateCustomParameter1683724062400,
  CreateDismantle1693120862000,
  CreateEventHistory1563804040010,
  CreateEventHistoryComponents1563804040020,
  CreateGameBalance1686896594700,
  CreateGrade1657846587000,
  CreateLotteryRoundAggregationAt1660436476130,
  CreateLotteryRoundAt1660436476100,
  CreateMerchant1563803000110,
  CreateMerge1697979517000,
  CreateMysterybox1653616447910,
  CreateNetwork1563803000060,
  CreateOrder1683724062000,
  CreateOrderItem1683724062100,
  CreateOtp1563803000160,
  CreatePage1563803000210,
  CreateParameter1683724061600,
  CreatePhoto1683724061800,
  CreatePonziDeposit1660436477300,
  CreatePonziRules1660436477200,
  CreateProduct1683724061400,
  CreateProductItem1683724061500,
  CreateProductItemParameter1683724062600,
  CreateProductPromo1683724062300,
  CreateProductToCategory1683724061700,
  CreateRaffleRoundAt1685961136110,
  CreateRatePlan1687519905500,
  CreateReferralClaimAt1660006909900,
  CreateReferralProgramAt1660003709900,
  CreateReferralRewardAt1660005709900,
  CreateReferralRewardSharesAt1660006919900,
  CreateReferralTreeAt1660004709900,
  CreateRent1678931845500,
  CreateSettings1563803000010,
  CreateStakingDeposit1654751224300,
  CreateStakingPenalty1654751224535,
  CreateStakingRules1654751224200,
  CreateStock1683724062500,
  CreateTemplate1563804000200,
  CreateToken1563804000300,
  CreateTransactionHistory1563804040009,
  CreateUser1563803000130,
  CreateWaitListItem1663047650300,
  CreateWaitListList1663047650200,
  CreateWalletPayees1663047650500,
  SeedAccessControlCollectionAt1679894502230,
  SeedAccessControlErc1155At1653616447250,
  SeedAccessControlErc20At1653616447220,
  SeedAccessControlErc721At1653616447230,
  SeedAccessControlErc998At1653616447240,
  SeedAccessListErc1155At1653616447350,
  SeedAccessListErc20At1653616447320,
  SeedAccessListErc721At1653616447330,
  SeedAccessListErc998At1653616447340,
  SeedAchievementClaimErc721At1681273013071,
  SeedAchievementItem1681273013060,
  SeedAchievementLevel1681273013040,
  SeedAchievementRedemption1681273013080,
  SeedAchievementRule1681273013020,
  SeedAddress1683724061910,
  SeedAssetComponentGrade1657846587020,
  SeedAssetComponentProductItemAt1683724061520,
  SeedAssetComponentRent1678931845520,
  SeedAssetComponentsAchievementAt1681273013045,
  SeedAssetComponentsAchievementRule1681273013025,
  SeedAssetComponentsCollectionAt1679894501230,
  SeedAssetComponentsErc1155At1563804001250,
  SeedAssetComponentsErc721At1563804001230,
  SeedAssetComponentsErc998At1563804001240,
  SeedAssetComponentsMysteryboxAt1563804001260,
  SeedAssetComponentsWaitListAt1663047650220,
  SeedAssetPromoErc1155At1658980521050,
  SeedAssetPromoErc721At1658980521030,
  SeedAssetPromoErc998At1658980521040,
  SeedAssetPromoMysteryBoxAt1658980521050,
  SeedBalanceCollectionAt1679894500430,
  SeedBalanceErc1155At1563804020450,
  SeedBalanceErc20At1563804020420,
  SeedBalanceErc20Erc998At1563804020450,
  SeedBalanceErc20LinkAt1563804020424,
  SeedBalanceErc20UsdtAt1563804020421,
  SeedBalanceErc20WethAt1563804020422,
  SeedBalanceErc721At1563804020430,
  SeedBalanceErc721MysteryAt1563804020460,
  SeedBalanceErc721WrapperAt1563804020470,
  SeedBalanceErc998At1563804020440,
  SeedBalanceLotteryTicketAt1563804020480,
  SeedBalancePonziAt1663047650530,
  SeedBalanceRaffleTicketAt1685961134480,
  SeedBalanceStakingAt1654751224530,
  SeedBalanceVestingAt1563804000490,
  SeedBreed1663047650401,
  SeedCategory1683724061310,
  SeedChainLinkSubscriptions1563803000122,
  SeedClaimErc1155At1653616447850,
  SeedClaimErc20At1653616447820,
  SeedClaimErc721At1653616447830,
  SeedClaimErc998At1653616447840,
  SeedClaimMixedAt1653616447870,
  SeedClaimMysteryboxAt1653616447860,
  SeedClaimVestingAt1687835680100,
  SeedCompositionAt1658980520010,
  SeedContractChainLinkVrfAt1563804000105,
  SeedContractCollectionAt1679894500000,
  SeedContractDispenserAt1692165706800,
  SeedContractErc1155At1563804000150,
  SeedContractErc1155DumbWayToDieAt1563804000151,
  SeedContractErc20At1563804000120,
  SeedContractErc20LINKAt1563804000124,
  SeedContractErc20UsdtAt1563804000121,
  SeedContractErc20WethAt1563804000122,
  SeedContractErc721At1563804000130,
  SeedContractErc721CryptoKittiesAt1563804000131,
  SeedContractErc998At1563804000140,
  SeedContractExchangeAt1563804000102,
  SeedContractLotteryAt1660436476100,
  SeedContractLotteryTicketAt1563804000180,
  SeedContractManagerAt1563804000101,
  SeedContractMysteryAt1563804000160,
  SeedContractNativeAt1563804000110,
  SeedContractPaymentSplitterAt1697876719370,
  SeedContractPonziAt1660436477100,
  SeedContractRaffleAt1685961136100,
  SeedContractRaffleTicketAt1685961134180,
  SeedContractStakingAt1654751224100,
  SeedContractVestingAt1563804000190,
  SeedContractWaitlistAt1663047650100,
  SeedContractWrapperAt1563804000170,
  SeedCraftErc1155Erc1155RecipesAt1653616448020,
  SeedCraftErc721Erc1155RecipesAt1653616448350,
  SeedCustomParameter1683724062410,
  SeedDismantleErc1155Erc155RecipesAt1693120862550,
  SeedDismantleErc721Erc155RecipesAt1693120862350,
  SeedEventHistoryErc1155Erc1155CraftAt1687760535510,
  SeedEventHistoryErc1155Erc1155CraftComponentsAt1687760535520,
  SeedEventHistoryErc1155PurchaseAt1563804040230,
  SeedEventHistoryErc1155PurchaseComponentsAt1563804040240,
  SeedEventHistoryErc1155TransferBatchAt1563804040140,
  SeedEventHistoryErc1155TransferSingleAt1563804040130,
  SeedEventHistoryErc20ClaimAt1653616447920,
  SeedEventHistoryErc20ClaimComponentsAt1653616447925,
  SeedEventHistoryErc20TransferAt1563804040120,
  SeedEventHistoryErc721ClaimAt1653616447930,
  SeedEventHistoryErc721ClaimComponentsAt1653616447935,
  SeedEventHistoryErc721Erc1155CraftAt1687760533510,
  SeedEventHistoryErc721Erc1155CraftComponentsAt1687760533520,
  SeedEventHistoryErc721GradeAt1687481746310,
  SeedEventHistoryErc721GradeComponentsAt1687481746320,
  SeedEventHistoryErc721LendAt1678931845530,
  SeedEventHistoryErc721LendComponentsAt1678931845540,
  SeedEventHistoryErc721PurchaseAt1563804040230,
  SeedEventHistoryErc721PurchaseComponentsAt1563804040240,
  SeedEventHistoryErc721TransferAt1563804040130,
  SeedEventHistoryErc998ClaimAt1653616447940,
  SeedEventHistoryErc998ClaimComponentsAt1653616447945,
  SeedEventHistoryErc998GradeAt1687481746410,
  SeedEventHistoryErc998GradeComponentsAt1687481746420,
  SeedEventHistoryErc998PurchaseAt1563804040230,
  SeedEventHistoryErc998PurchaseComponentsAt1563804040240,
  SeedEventHistoryErc998TransferAt1563804040130,
  SeedEventHistoryLotteryTicketPurchaseAt1660436476310,
  SeedEventHistoryLotteryTicketPurchaseComponentsAt1660436476310,
  SeedEventHistoryMysteryErc721PurchaseAt1687580606310,
  SeedEventHistoryMysteryErc721PurchaseComponentsAt1687580606320,
  SeedEventHistoryMysteryErc721UnpackAt1687580606330,
  SeedEventHistoryMysteryErc721UnpackComponentsAt1687580606340,
  SeedEventHistoryMysteryMixedPurchaseAt1687580606610,
  SeedEventHistoryMysteryMixedPurchaseComponentsAt1687580606620,
  SeedEventHistoryMysteryMixedUnpackAt1687580606630,
  SeedEventHistoryMysteryMixedUnpackComponentsAt1687580606640,
  SeedEventHistoryRaffleTicketPurchaseAt1685961136310,
  SeedEventHistoryRaffleTicketPurchaseComponentsAt1685961136320,
  SeedEventHistoryVestingTransferOwnershipAt1687338973200,
  SeedEventHistoryWaitListAt1663047650350,
  SeedEventHistoryWaitListComponentsAt1663047650360,
  SeedGameBalance1686896594710,
  SeedGrade1657846587010,
  SeedLotteryRoundAggregationAt1660436476140,
  SeedLotteryRoundAt1660436476120,
  SeedMerchant1563803000120,
  SeedMergeErc721Erc721RecipesAt1697979517330,
  SeedMysteryBoxErc1155At1653616447950,
  SeedMysteryBoxErc721At1653616447930,
  SeedMysteryBoxErc998At1653616447940,
  SeedMysteryBoxMixedAt1653616447970,
  SeedNetwork1563803000070,
  SeedOrder1683724062010,
  SeedPage1563803000220,
  SeedParameter1683724061610,
  SeedPhoto1683724061810,
  SeedPonziDepositErc20Erc20At1660436477320,
  SeedPonziDepositNativeNativeAt1660436477310,
  SeedPonziPayees1663047650520,
  SeedPonziRulesErc20At1660436477220,
  SeedPonziRulesNativeAt1660436477210,
  SeedProduct1683724061410,
  SeedProductItem1683724061510,
  SeedProductItemParameter1683724062610,
  SeedProductPromo1683724062310,
  SeedProductToCategory1683724061710,
  SeedRaffleRoundAt1685961136120,
  SeedRatePlan1687519905500,
  // SeedReferralRewardAt1660103709910,
  SeedRent1678931845510,
  SeedSettings1563803000020,
  SeedStakingDepositErc20Erc20At1654751224322,
  SeedStakingDepositErc20Erc721At1654751224323,
  SeedStakingDepositErc20NoneAt1654751224329,
  SeedStakingDepositErc721NoneAt1654751224339,
  SeedStakingDepositErc998Erc1155At1654751224345,
  SeedStakingDepositNativeNativeAt1654751224311,
  SeedStakingRulesErc1155At1654751224250,
  SeedStakingRulesErc20At1654751224220,
  SeedStakingRulesErc721At1654751224230,
  SeedStakingRulesErc998At1654751224240,
  SeedStakingRulesMixedAt1654751224270,
  SeedStakingRulesMysteryboxAt1654751224260,
  SeedStakingRulesNativeAt1654751224210,
  SeedStock1683724062510,
  SeedTemplateCollectionAt1679894500230,
  SeedTemplateErc1155At1563804000250,
  SeedTemplateErc20At1563804000220,
  SeedTemplateErc20LinkAt1563804000224,
  SeedTemplateErc20UsdtAt1563804000221,
  SeedTemplateErc20WethAt1563804000222,
  SeedTemplateErc721At1563804000230,
  SeedTemplateErc998At1563804000240,
  SeedTemplateLotteryTicketAt1563804000280,
  SeedTemplateMysteryAt1563804000260,
  SeedTemplateNativeAt1563804000210,
  SeedTemplateRaffleTicketAt1685961134280,
  SeedTemplateWrapperAt1563804000270,
  SeedTokenCollectionAt1679894500330,
  SeedTokenErc1155At1563804000350,
  SeedTokenErc20At1563804000320,
  SeedTokenErc20LinkAt1563804000324,
  SeedTokenErc20UsdtAt1563804000321,
  SeedTokenErc20WethAt1563804000322,
  SeedTokenErc721At1563804000330,
  SeedTokenErc998At1563804000340,
  SeedTokenLotteryTicketAt1563804000380,
  SeedTokenMysteryAt1563804000360,
  SeedTokenNativeAt1563804000310,
  SeedTokenRaffleTicketAt1685961134380,
  SeedUser1563803000140,
  SeedWaitListItemAt1663047650310,
  SeedWaitListListAt1663047650210,
  SeedWrapperAt1563804000370,
} from "./migrations";
import { AlterClaimTypeEnum1900000000000 } from "./migrations/06-alter/1900000000000-alter-claim-type-enum";
import { ReferralRewardShareEntity } from "./blockchain/mechanics/referral/reward/share/referral.reward.share.entity";
import { ReferralTreeEntity } from "./blockchain/mechanics/referral/program/tree/referral.tree.entity";
import { ReferralClaimEntity } from "./blockchain/mechanics/referral/claim/referral.claim.entity";

// TEST DATA 100k topics
// import { SeedTestDataAt9763804000120 } from "./migrations/9763804000120-seed-test-data";
// Check typeORM documentation for more information.
const config: PostgresConnectionOptions = {
  name: "default",
  type: "postgres",
  entities: [
    /* infrastructure */
    MerchantEntity,
    ChainLinkSubscriptionEntity,
    UserEntity,
    OtpEntity,
    SettingsEntity,
    NetworkEntity,
    RatePlanEntity,
    /* blockchain */
    ContractManagerEntity,
    EventHistoryEntity,
    // exchange
    AssetEntity,
    AssetComponentEntity,
    AssetComponentHistoryEntity,
    PayeesEntity,
    // extensions
    AccessControlEntity,
    AccessListEntity,
    // hierarchy
    ContractEntity,
    TemplateEntity,
    TokenEntity,
    BalanceEntity,
    CompositionEntity,
    // mechanics
    BreedEntity,
    ClaimEntity,
    CraftEntity,
    DismantleEntity,
    MergeEntity,
    AssetPromoEntity,
    GradeEntity,
    LotteryRoundEntity,
    LotteryRoundAggregationEntity,
    RaffleRoundEntity,
    MysteryBoxEntity,
    PonziRulesEntity,
    PonziDepositEntity,
    RentEntity,
    StakingRulesEntity,
    StakingDepositEntity,
    StakingPenaltyEntity,
    WaitListItemEntity,
    WaitListListEntity,
    ReferralRewardEntity,
    ReferralRewardShareEntity,
    ReferralProgramEntity,
    ReferralTreeEntity,
    ReferralClaimEntity,
    /* ecommerce */
    AddressEntity,
    CategoryEntity,
    MerchantEntity,
    OrderEntity,
    OrderItemEntity,
    CustomParameterEntity,
    ParameterEntity,
    PhotoEntity,
    ProductEntity,
    ProductItemEntity,
    ProductItemParameterEntity,
    ProductPromoEntity,
    StockEntity,
    /* achievements */
    AchievementItemEntity,
    AchievementLevelEntity,
    AchievementRuleEntity,
    AchievementRedemptionEntity,
  ],
  // We are using migrations, synchronize should public-api set to false.
  synchronize: false,
  // Run migrations automatically,
  // you can disable this if you prefer running migration manually.
  migrationsRun: process.env.BUSINESS_TYPE === BusinessType.B2B || process.env.NODE_ENV === NodeEnv.development, // run only at B2B instance
  // migrationsRun: true,
  migrationsTableName: ns,
  migrationsTransactionMode: "each",
  namingStrategy: new SnakeNamingStrategy(),
  logging: (process.env.LOG_MODE && process.env.LOG_MODE === "true") || false,
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
    CreateNetwork1563803000060,
    SeedNetwork1563803000070,
    CreateMerchant1563803000110,
    CreateChainLinkSubscriptions1563803000121,
    SeedMerchant1563803000120,
    SeedChainLinkSubscriptions1563803000122,
    CreateUser1563803000130,
    SeedUser1563803000140,
    CreateAuth1563803000150,
    CreateOtp1563803000160,
    CreatePage1563803000210,
    SeedPage1563803000220,
    CreateRatePlan1687519905500,
    SeedRatePlan1687519905500,
    AlterMerchant1687519905550,

    CreateAsset1563804000100,

    CreateContract1563804000100,
    SeedContractManagerAt1563804000101,
    SeedContractExchangeAt1563804000102,
    SeedContractNativeAt1563804000110,
    SeedContractErc20At1563804000120,
    SeedContractErc20UsdtAt1563804000121,
    SeedContractErc20WethAt1563804000122,
    SeedContractErc20LINKAt1563804000124,
    SeedContractErc721At1563804000130,
    SeedContractErc721CryptoKittiesAt1563804000131,
    SeedContractErc998At1563804000140,
    SeedContractErc1155At1563804000150,
    SeedContractErc1155DumbWayToDieAt1563804000151,
    SeedContractWrapperAt1563804000170,

    CreateTemplate1563804000200,
    SeedTemplateNativeAt1563804000210,
    SeedTemplateErc20At1563804000220,
    SeedTemplateErc20UsdtAt1563804000221,
    SeedTemplateErc20WethAt1563804000222,
    SeedTemplateErc20LinkAt1563804000224,
    SeedTemplateErc721At1563804000230,
    SeedTemplateErc998At1563804000240,
    SeedTemplateErc1155At1563804000250,
    SeedTemplateWrapperAt1563804000270,

    CreateToken1563804000300,
    SeedTokenNativeAt1563804000310,
    SeedTokenErc20At1563804000320,
    SeedTokenErc20UsdtAt1563804000321,
    SeedTokenErc20WethAt1563804000322,
    SeedTokenErc20LinkAt1563804000324,
    SeedTokenErc721At1563804000330,
    SeedTokenErc998At1563804000340,
    SeedTokenErc1155At1563804000350,
    SeedWrapperAt1563804000370,

    CreateBalance1563804000400,
    SeedBalanceErc20At1563804020420,
    SeedBalanceErc20UsdtAt1563804020421,
    SeedBalanceErc20WethAt1563804020422,
    SeedBalanceErc20LinkAt1563804020424,
    SeedBalanceErc721At1563804020430,
    SeedBalanceErc998At1563804020440,
    SeedBalanceErc20Erc998At1563804020450,
    SeedBalanceErc1155At1563804020450,
    SeedBalanceErc721WrapperAt1563804020470,

    CreateAssetComponent1563804001220,
    SeedAssetComponentsErc721At1563804001230,
    SeedAssetComponentsErc998At1563804001240,
    SeedAssetComponentsErc1155At1563804001250,

    CreateAccessControl1653616447200,
    SeedAccessControlErc20At1653616447220,
    SeedAccessControlErc721At1653616447230,
    SeedAccessControlErc998At1653616447240,
    SeedAccessControlErc1155At1653616447250,

    CreateAccessList1653616447300,
    SeedAccessListErc20At1653616447320,
    SeedAccessListErc721At1653616447330,
    SeedAccessListErc998At1653616447340,
    SeedAccessListErc1155At1653616447350,

    CreateClaim1653616447810,
    SeedClaimErc20At1653616447820,
    SeedClaimErc721At1653616447830,
    SeedClaimErc998At1653616447840,
    SeedClaimErc1155At1653616447850,
    SeedClaimMysteryboxAt1653616447860,
    SeedClaimMixedAt1653616447870,
    SeedEventHistoryErc20ClaimAt1653616447920,
    SeedEventHistoryErc20ClaimComponentsAt1653616447925,
    SeedEventHistoryErc721ClaimAt1653616447930,
    SeedEventHistoryErc721ClaimComponentsAt1653616447935,
    SeedEventHistoryErc998ClaimAt1653616447940,
    SeedEventHistoryErc998ClaimComponentsAt1653616447945,

    SeedContractVestingAt1563804000190,
    SeedBalanceVestingAt1563804000490,
    SeedEventHistoryVestingTransferOwnershipAt1687338973200,
    SeedClaimVestingAt1687835680100,

    CreateMysterybox1653616447910,
    SeedContractMysteryAt1563804000160,
    SeedTemplateMysteryAt1563804000260,
    SeedTokenMysteryAt1563804000360,
    SeedBalanceErc721MysteryAt1563804020460,
    SeedAssetComponentsMysteryboxAt1563804001260,
    SeedMysteryBoxErc721At1653616447930,
    SeedMysteryBoxErc998At1653616447940,
    SeedMysteryBoxErc1155At1653616447950,
    SeedMysteryBoxMixedAt1653616447970,
    SeedEventHistoryMysteryErc721PurchaseAt1687580606310,
    SeedEventHistoryMysteryErc721PurchaseComponentsAt1687580606320,
    SeedEventHistoryMysteryErc721UnpackAt1687580606330,
    SeedEventHistoryMysteryErc721UnpackComponentsAt1687580606340,
    SeedEventHistoryMysteryMixedPurchaseAt1687580606610,
    SeedEventHistoryMysteryMixedPurchaseComponentsAt1687580606620,
    SeedEventHistoryMysteryMixedUnpackAt1687580606630,
    SeedEventHistoryMysteryMixedUnpackComponentsAt1687580606640,

    CreateCraft1653616448000,
    SeedCraftErc1155Erc1155RecipesAt1653616448020,
    SeedCraftErc721Erc1155RecipesAt1653616448350,
    SeedEventHistoryErc721Erc1155CraftAt1687760533510,
    SeedEventHistoryErc721Erc1155CraftComponentsAt1687760533520,
    SeedEventHistoryErc1155Erc1155CraftAt1687760535510,
    SeedEventHistoryErc1155Erc1155CraftComponentsAt1687760535520,

    CreateDismantle1693120862000,
    SeedDismantleErc721Erc155RecipesAt1693120862350,
    SeedDismantleErc1155Erc155RecipesAt1693120862550,

    CreateMerge1697979517000,
    SeedMergeErc721Erc721RecipesAt1697979517330,

    SeedContractStakingAt1654751224100,
    CreateStakingRules1654751224200,
    SeedStakingRulesNativeAt1654751224210,
    SeedStakingRulesErc20At1654751224220,
    SeedStakingRulesErc721At1654751224230,
    SeedStakingRulesErc998At1654751224240,
    SeedStakingRulesErc1155At1654751224250,
    SeedStakingRulesMysteryboxAt1654751224260,
    SeedStakingRulesMixedAt1654751224270,
    CreateStakingDeposit1654751224300,
    SeedStakingDepositNativeNativeAt1654751224311,
    SeedStakingDepositErc20Erc20At1654751224322,
    SeedStakingDepositErc20Erc721At1654751224323,
    SeedStakingDepositErc20NoneAt1654751224329,
    SeedStakingDepositErc721NoneAt1654751224339,
    SeedStakingDepositErc998Erc1155At1654751224345,
    SeedBalanceStakingAt1654751224530,
    CreateStakingPenalty1654751224535,

    CreateGrade1657846587000,
    SeedGrade1657846587010,
    SeedAssetComponentGrade1657846587020,
    SeedEventHistoryErc721GradeAt1687481746310,
    SeedEventHistoryErc721GradeComponentsAt1687481746320,
    SeedEventHistoryErc998GradeAt1687481746410,
    SeedEventHistoryErc998GradeComponentsAt1687481746420,

    CreateTransactionHistory1563804040009,
    CreateEventHistory1563804040010,
    CreateEventHistoryComponents1563804040020,
    SeedEventHistoryErc20TransferAt1563804040120,
    SeedEventHistoryErc721TransferAt1563804040130,
    SeedEventHistoryErc721PurchaseAt1563804040230,
    SeedEventHistoryErc721PurchaseComponentsAt1563804040240,
    SeedEventHistoryErc998TransferAt1563804040130,
    SeedEventHistoryErc998PurchaseAt1563804040230,
    SeedEventHistoryErc998PurchaseComponentsAt1563804040240,
    SeedEventHistoryErc1155TransferSingleAt1563804040130,
    SeedEventHistoryErc1155TransferBatchAt1563804040140,
    SeedEventHistoryErc1155PurchaseAt1563804040230,
    SeedEventHistoryErc1155PurchaseComponentsAt1563804040240,

    CreateCompositionAt1658980520000,
    SeedCompositionAt1658980520010,

    CreateAssetPromoAt1658980521000,
    SeedAssetPromoErc721At1658980521030,
    SeedAssetPromoErc998At1658980521040,
    SeedAssetPromoErc1155At1658980521050,
    SeedAssetPromoMysteryBoxAt1658980521050,

    // REFERRAl PROGRAM
    CreateReferralProgramAt1660003709900,
    CreateReferralTreeAt1660004709900,
    CreateReferralRewardAt1660005709900,
    // SeedReferralRewardAt1660103709910,
    CreateReferralRewardSharesAt1660006919900,
    CreateReferralClaimAt1660006909900,

    // LOTTERY
    SeedContractLotteryTicketAt1563804000180,
    SeedTemplateLotteryTicketAt1563804000280,
    SeedTokenLotteryTicketAt1563804000380,
    SeedBalanceLotteryTicketAt1563804020480,
    SeedContractLotteryAt1660436476100,
    CreateLotteryRoundAt1660436476100,
    SeedLotteryRoundAt1660436476120,
    CreateLotteryRoundAggregationAt1660436476130,
    SeedLotteryRoundAggregationAt1660436476140,
    SeedEventHistoryLotteryTicketPurchaseAt1660436476310,
    SeedEventHistoryLotteryTicketPurchaseComponentsAt1660436476310,

    // RAFFLE
    SeedContractRaffleAt1685961136100,
    SeedContractRaffleTicketAt1685961134180,
    SeedTemplateRaffleTicketAt1685961134280,
    SeedTokenRaffleTicketAt1685961134380,
    SeedBalanceRaffleTicketAt1685961134480,
    CreateRaffleRoundAt1685961136110,
    SeedRaffleRoundAt1685961136120,
    SeedEventHistoryRaffleTicketPurchaseAt1685961136310,
    SeedEventHistoryRaffleTicketPurchaseComponentsAt1685961136320,

    // PONZI
    SeedContractPonziAt1660436477100,
    CreatePonziRules1660436477200,
    SeedPonziRulesNativeAt1660436477210,
    SeedPonziRulesErc20At1660436477220,
    CreatePonziDeposit1660436477300,
    SeedPonziDepositNativeNativeAt1660436477310,
    SeedPonziDepositErc20Erc20At1660436477320,
    SeedPonziPayees1663047650520,
    SeedBalancePonziAt1663047650530,

    SeedContractWaitlistAt1663047650100,
    CreateWaitListList1663047650200,
    SeedWaitListListAt1663047650210,
    SeedAssetComponentsWaitListAt1663047650220,
    CreateWaitListItem1663047650300,
    SeedWaitListItemAt1663047650310,
    SeedEventHistoryWaitListAt1663047650350,
    SeedEventHistoryWaitListComponentsAt1663047650360,

    CreateBreed1663047650400,
    SeedBreed1663047650401,

    SeedContractCollectionAt1679894500000,
    SeedTemplateCollectionAt1679894500230,
    SeedTokenCollectionAt1679894500330,
    SeedBalanceCollectionAt1679894500430,
    SeedAssetComponentsCollectionAt1679894501230,
    SeedAccessControlCollectionAt1679894502230,

    CreateWalletPayees1663047650500,
    SeedContractChainLinkVrfAt1563804000105,

    CreateRent1678931845500,
    SeedAssetComponentRent1678931845520,
    SeedRent1678931845510,
    SeedEventHistoryErc721LendAt1678931845530,
    SeedEventHistoryErc721LendComponentsAt1678931845540,

    SeedContractDispenserAt1692165706800,

    SeedContractPaymentSplitterAt1697876719370,

    /* ecommerce */
    CreateCategory1683724061300,
    SeedCategory1683724061310,
    CreateProduct1683724061400,
    SeedProduct1683724061410,
    CreateProductItem1683724061500,
    SeedProductItem1683724061510,
    SeedAssetComponentProductItemAt1683724061520,
    CreateParameter1683724061600,
    SeedParameter1683724061610,
    CreateProductToCategory1683724061700,
    SeedProductToCategory1683724061710,
    CreatePhoto1683724061800,
    SeedPhoto1683724061810,
    CreateAddress1683724061900,
    SeedAddress1683724061910,
    CreateOrder1683724062000,
    SeedOrder1683724062010,
    CreateOrderItem1683724062100,
    // @TODO uncomment after fix order items
    // SeedOrderItems1683724062110,
    CreateCart1683724062200,
    CreateCartItem1683724062210,
    CreateProductPromo1683724062300,
    SeedProductPromo1683724062310,
    CreateCustomParameter1683724062400,
    SeedCustomParameter1683724062410,
    CreateStock1683724062500,
    SeedStock1683724062510,
    CreateProductItemParameter1683724062600,
    SeedProductItemParameter1683724062610,

    /* achievements */
    CreateAchievementRule1681273013010,
    SeedAchievementRule1681273013020,
    SeedAssetComponentsAchievementRule1681273013025,
    CreateAchievementLevel1681273013030,
    SeedAchievementLevel1681273013040,
    SeedAssetComponentsAchievementAt1681273013045,
    CreateAchievementItem1681273013050,
    SeedAchievementItem1681273013060,
    CreateAchievementRedemption1681273013070,
    SeedAchievementClaimErc721At1681273013071,
    SeedAchievementRedemption1681273013080,

    /* game */
    CreateGameBalance1686896594700,
    SeedGameBalance1686896594710,

    /* alter prod migrations */
    // SeedTestDataAt9763804000120,
    AlterClaimTypeEnum1900000000000,
  ],
};

export default config;
