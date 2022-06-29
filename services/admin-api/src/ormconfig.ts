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
import { UniContractEntity } from "./blockchain/uni-token/uni-contract.entity";
import { AssetEntity } from "./blockchain/asset/asset.entity";
import { UniTemplateEntity } from "./blockchain/uni-token/uni-template.entity";
import { UniTokenEntity } from "./blockchain/uni-token/uni-token.entity";
import { AssetComponentEntity } from "./blockchain/asset/asset-component.entity";
import { AccessControlEntity } from "./blockchain/access-control/access-control.entity";
import { AccessListEntity } from "./blockchain/access-list/access-list.entity";
import { AirdropEntity } from "./mechanics/airdrop/airdrop.entity";
import { DropboxEntity } from "./mechanics/dropbox/dropbox.entity";
import { StakesEntity } from "./mechanics/staking/stakes/stakes.entity";
import { ExchangeEntity } from "./mechanics/exchange/exchange.entity";
import { StakingRulesEntity } from "./mechanics/staking/staking-rules/staking-rules.entity";
import { StakingHistoryEntity } from "./mechanics/staking/staking-history/staking-history.entity";
import { PageEntity } from "./page/page.entity";

import { CreateUserTable1563804000010 } from "./migrations/1563804000010-create-user-table";
import { SeedUser1563804000020 } from "./migrations/1563804000020-seed-user";
import { CreateOtpTable1563804000060 } from "./migrations/1563804000060-create-otp-table";
import { CreateUniContract1563804000110 } from "./migrations/1563804000110-create-uni-contract";
import { SeedUniContract1563804000120 } from "./migrations/1563804000120-seed-uni-contract-erc20";
import { SeedUniContract1563804000130 } from "./migrations/1563804000130-seed-uni-contract-erc721";
import { SeedUniContract1563804000140 } from "./migrations/1563804000140-seed-uni-contract-erc998";
import { SeedUniContract1563804000150 } from "./migrations/1563804000150-seed-uni-contract-erc1155";

import { CreateAsset1563804000210 } from "./migrations/1563804000210-create-asset";
import { CreateAssetComponent1563804000220 } from "./migrations/1563804000220-create-asset-component";

import { CreateErc20TokenHistoryTable1563804010130 } from "./migrations/1563804010130-create-erc20-token-history-table";
import { CreateErc20VestingTable1563804010210 } from "./migrations/1563804010210-create-erc20-vesting-table";
import { SeedErc20Vesting1563804010220 } from "./migrations/1563804010220-seed-erc20-vesting";

import { CreateErc20VestingHistoryTable1563804010230 } from "./migrations/1563804010230-create-erc20-vesting-history-table";
import { CreateErc998TemplateTable1563804030110 } from "./migrations/1563804030110-create-erc998-template-table";
import { SeedErc998Templates1563804030120 } from "./migrations/1563804030120-seed-erc998-template";
import { CreateErc998DropboxTable1563804030210 } from "./migrations/1563804030210-create-erc998-dropbox-table";
import { SeedErc998Dropbox1563804030220 } from "./migrations/1563804030220-seed-erc998-dropbox";
import { CreateErc998TokenTable1563804030310 } from "./migrations/1563804030310-create-erc998-token-table";
import { SeedErc998Token1563804030320 } from "./migrations/1563804030320-seed-erc998-tokens";
import { CreateErc998TokenHistoryTable1563804030330 } from "./migrations/1563804030330-create-erc998-token-history-table";
import { CreateErc998MarketplaceHistoryTable1563804030510 } from "./migrations/1563804030510-create-erc998-marketplace-history-table";

import { CreateErc721TemplateTable1563804040110 } from "./migrations/1563804040110-create-erc721-template-table";
import { SeedErc721Templates1563804040120 } from "./migrations/1563804040120-seed-erc721-template";
import { CreateErc721DropboxTable1563804040210 } from "./migrations/1563804040210-create-erc721-dropbox-table";
import { SeedErc721Dropbox1563804040220 } from "./migrations/1563804040220-seed-erc721-dropbox";
import { CreateErc721TokenTable1563804040310 } from "./migrations/1563804040310-create-erc721-token-table";
import { SeedErc721Token1563804040320 } from "./migrations/1563804040320-seed-erc721-tokens";
import { CreateErc721TokenHistoryTable1563804040330 } from "./migrations/1563804040330-create-erc721-token-history-table";
import { CreateErc721MarketplaceHistoryTable1563804040510 } from "./migrations/1563804040510-create-erc721-marketplace-history-table";

import { CreateExchangeHistory1653616448050 } from "./migrations/1653616448050-create-exchnage-history";
import { CreateErc1155TokenTable1563804020120 } from "./migrations/1563804020110-create-erc1155-token-table";
import { SeedErc1155Tokens1563804020120 } from "./migrations/1563804020120-seed-erc1155-token";
import { CreateErc1155TokenHistoryTable1563804020130 } from "./migrations/1563804020130-create-erc1155-token-history-table";
import { CreateErc1155MarketplaceHistoryTable1563804020210 } from "./migrations/1563804020210-create-erc1155-marketplace-history-table";
import { CreateErc1155BalanceTable1563804020310 } from "./migrations/1563804020310-create-erc1155-balance-table";
import { SeedErc1155Balance1563804020320 } from "./migrations/1563804020320-seed-erc1155-balance";
import { CreateExchange1653616448010 } from "./migrations/1653616448010-create-exchange";
import { SeedExchange1653616448020 } from "./migrations/1653616448020-seed-exchange-erc1155";

import { CreateAirdropTable1563804040410 } from "./migrations/1563804040410-create-erc721-airdrop-table";
import { SeedAirdrop1563804040420 } from "./migrations/1563804040420-seed-erc721-airdrop";
import { Erc20VestingEntity } from "./erc20/vesting/vesting.entity";
import { CreateErc721Recipe1563804040610 } from "./migrations/1563804040610-create-erc721-recipe-table";
import { SeedErc721Recipe1563804040620 } from "./migrations/1563804040620-seed-erc721-recipe";
import { CreateErc721RecipeHistory1563804040630 } from "./migrations/1563804040630-create-erc721-recipe-history";
import { CreateErc721Ingredient1563804040710 } from "./migrations/1563804040710-create-erc721-ingredient-table";
import { SeedErc721Ingredient1563804040720 } from "./migrations/1563804040720-seed-erc721-ingredient";
import { CreateContractManagerHistoryTable1652682493386 } from "./migrations/1652682493386-create-contract-manager-history-table";
import { CreateContractManagerTable1652962207600 } from "./migrations/1652962207600-create-contract-manager-table";
import { SeedContractManager1652962207610 } from "./migrations/1652962207610-seed-contract-manager-table";
import { CreateAccessControlTable1653616447230 } from "./migrations/1653616447230-create-access-control-table";
import { CreateAccessControlHistoryTable1653616447240 } from "./migrations/1653616447240-create-access-control-history-table";
import { CreateAccessListTable1653616447330 } from "./migrations/1653616447330-create-access-list-table";
import { CreateAccessListHistoryTable1653616447340 } from "./migrations/1653616447340-create-access-list-history-table";
import { CreateSettingsTable1654437010000 } from "./migrations/1654437010000-create-settings-table";
import { SeedSettingsTable1654437010010 } from "./migrations/1654437010010-seed-settings-table";
import { CreateStakingTable1654751224200 } from "./migrations/1654751224200-create-staking-table";
import { SeedStakingTable1654751224210 } from "./migrations/1654751224210-seed-staking-table";
import { CreateStakingHistoryTable1654751224260 } from "./migrations/1654751224260-create-staking-history-table";
import { CreatePageTable1655626535100 } from "./migrations/1655626535100-create-page-table";
import { SeedPages1655626535110 } from "./migrations/1655626535110-seed-pages";
import { CreateStakesTable1654751224255 } from "./migrations/1654751224255-create-stakes-table";

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
    Erc20VestingEntity,
    UniContractEntity,
    UniTemplateEntity,
    StakesEntity,
    StakingRulesEntity,
    StakingHistoryEntity,
    PageEntity,
    AssetEntity,
    AssetComponentEntity,
    UniContractEntity,
    UniTemplateEntity,
    UniTokenEntity,
    AirdropEntity,
    DropboxEntity,
    ExchangeEntity,
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
    CreateUserTable1563804000010,
    SeedUser1563804000020,
    CreateOtpTable1563804000060,

    CreateAsset1563804000210,
    CreateAssetComponent1563804000220,

    CreateErc20TokenHistoryTable1563804010130,
    CreateErc20VestingTable1563804010210,
    SeedErc20Vesting1563804010220,
    CreateErc20VestingHistoryTable1563804010230,
    CreateErc998TemplateTable1563804030110,
    SeedErc998Templates1563804030120,
    CreateErc998DropboxTable1563804030210,
    SeedErc998Dropbox1563804030220,
    CreateErc998TokenTable1563804030310,
    SeedErc998Token1563804030320,
    CreateErc998TokenHistoryTable1563804030330,
    CreateErc998MarketplaceHistoryTable1563804030510,
    CreateErc721TemplateTable1563804040110,
    SeedErc721Templates1563804040120,
    CreateErc721DropboxTable1563804040210,
    SeedErc721Dropbox1563804040220,
    CreateErc721TokenTable1563804040310,
    SeedErc721Token1563804040320,
    CreateErc721TokenHistoryTable1563804040330,
    CreateErc721MarketplaceHistoryTable1563804040510,
    CreateAirdropTable1563804040410,
    SeedAirdrop1563804040420,
    CreateErc721Recipe1563804040610,
    SeedErc721Recipe1563804040620,
    CreateErc721RecipeHistory1563804040630,
    CreateErc721Ingredient1563804040710,
    SeedErc721Ingredient1563804040720,
    CreateErc1155TokenTable1563804020120,
    SeedErc1155Tokens1563804020120,
    CreateErc1155TokenHistoryTable1563804020130,
    CreateErc1155MarketplaceHistoryTable1563804020210,
    CreateExchangeHistory1653616448050,
    CreateErc1155BalanceTable1563804020310,
    SeedErc1155Balance1563804020320,
    CreateExchange1653616448010,
    SeedExchange1653616448020,
    CreateContractManagerHistoryTable1652682493386,
    CreateAccessControlTable1653616447230,
    CreateAccessControlHistoryTable1653616447240,
    CreateAccessListTable1653616447330,
    CreateAccessListHistoryTable1653616447340,
    CreateContractManagerTable1652962207600,
    SeedContractManager1652962207610,
    CreateSettingsTable1654437010000,
    SeedSettingsTable1654437010010,
    CreateStakingTable1654751224200,
    SeedStakingTable1654751224210,
    CreateStakesTable1654751224255,
    CreateStakingHistoryTable1654751224260,
    CreatePageTable1655626535100,
    SeedPages1655626535110,
    CreateUniContract1563804000110,
    SeedUniContract1563804000120,
    SeedUniContract1563804000130,
    SeedUniContract1563804000140,
    SeedUniContract1563804000150,
  ],
};

export default config;
