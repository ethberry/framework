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
import { Erc20TokenEntity } from "./erc20/token/token.entity";
import { Erc721CollectionEntity } from "./erc721/collection/collection.entity";
import { Erc721TemplateEntity } from "./erc721/template/template.entity";
import { Erc721TokenEntity } from "./erc721/token/token.entity";
import { Erc721DropboxEntity } from "./erc721/dropbox/dropbox.entity";
import { Erc721AirdropEntity } from "./erc721/airdrop/airdrop.entity";
import { Erc721RecipeEntity } from "./erc721/recipe/recipe.entity";
import { Erc721IngredientEntity } from "./erc721/recipe/ingredient/ingredient.entity";
import { Erc998CollectionEntity } from "./erc998/collection/collection.entity";
import { Erc998TemplateEntity } from "./erc998/template/template.entity";
import { Erc998TokenEntity } from "./erc998/token/token.entity";
import { Erc998DropboxEntity } from "./erc998/dropbox/dropbox.entity";
import { Erc998AirdropEntity } from "./erc998/airdrop/airdrop.entity";
import { Erc998RecipeEntity } from "./erc998/recipe/recipe.entity";
import { Erc998IngredientEntity } from "./erc998/recipe/ingredient/ingredient.entity";
import { Erc1155CollectionEntity } from "./erc1155/collection/collection.entity";
import { Erc1155TokenEntity } from "./erc1155/token/token.entity";
import { Erc1155RecipeEntity } from "./erc1155/recipe/recipe.entity";
import { Erc1155IngredientEntity } from "./erc1155/recipe/ingredient/ingredient.entity";
import { StakingEntity } from "./blockchain/staking/staking.entity";
import { StakingDepositEntity } from "./blockchain/staking/staking.deposit.entity";
import { StakingRewardEntity } from "./blockchain/staking/staking.reward.entity";
import { StakingHistoryEntity } from "./blockchain/staking/staking-history/staking-history.entity";

import { CreateUserTable1563804000010 } from "./migrations/1563804000010-create-user-table";
import { SeedUser1563804000020 } from "./migrations/1563804000020-seed-user";
import { CreateOtpTable1563804000060 } from "./migrations/1563804000060-create-otp-table";
import { CreateErc20TokenTable1563804010110 } from "./migrations/1563804010110-create-erc20-token-table";
import { SeedErc20Token1563804010120 } from "./migrations/1563804010120-seed-erc20-tokens";
import { CreateErc20TokenHistoryTable1563804010130 } from "./migrations/1563804010130-create-erc20-token-history-table";
import { CreateErc20VestingTable1563804010210 } from "./migrations/1563804010210-create-erc20-vesting-table";
import { SeedErc20Vesting1563804010220 } from "./migrations/1563804010220-seed-erc20-vesting";
import { CreateErc20VestingHistoryTable1563804010230 } from "./migrations/1563804010230-create-erc20-vesting-history-table";
import { CreateErc998CollectionTable1563804030010 } from "./migrations/1563804030010-create-erc998-collection-table";
import { SeedErc998Collection1563804030020 } from "./migrations/1563804030020-seed-erc998-collection";
import { CreateErc998TemplateTable1563804030110 } from "./migrations/1563804030110-create-erc998-template-table";
import { SeedErc998Templates1563804030120 } from "./migrations/1563804030120-seed-erc998-template";
import { CreateErc998DropboxTable1563804030210 } from "./migrations/1563804030210-create-erc998-dropbox-table";
import { SeedErc998Dropbox1563804030220 } from "./migrations/1563804030220-seed-erc998-dropbox";
import { CreateErc998TokenTable1563804030310 } from "./migrations/1563804030310-create-erc998-token-table";
import { SeedErc998Token1563804030320 } from "./migrations/1563804030320-seed-erc998-tokens";
import { CreateErc998TokenHistoryTable1563804030330 } from "./migrations/1563804030330-create-erc998-token-history-table";
import { CreateErc998MarketplaceHistoryTable1563804030510 } from "./migrations/1563804030510-create-erc998-marketplace-history-table";
import { CreateErc721CollectionTable1563804040010 } from "./migrations/1563804040010-create-erc721-collection-table";
import { SeedErc721Collection1563804040020 } from "./migrations/1563804040020-seed-erc721-collection";
import { CreateErc721TemplateTable1563804040110 } from "./migrations/1563804040110-create-erc721-template-table";
import { SeedErc721Templates1563804040120 } from "./migrations/1563804040120-seed-erc721-template";
import { CreateErc721DropboxTable1563804040210 } from "./migrations/1563804040210-create-erc721-dropbox-table";
import { SeedErc721Dropbox1563804040220 } from "./migrations/1563804040220-seed-erc721-dropbox";
import { CreateErc721TokenTable1563804040310 } from "./migrations/1563804040310-create-erc721-token-table";
import { SeedErc721Token1563804040320 } from "./migrations/1563804040320-seed-erc721-tokens";
import { CreateErc721TokenHistoryTable1563804040330 } from "./migrations/1563804040330-create-erc721-token-history-table";
import { CreateErc721MarketplaceHistoryTable1563804040510 } from "./migrations/1563804040510-create-erc721-marketplace-history-table";
import { CreateErc1155RecipeHistory1563804020430 } from "./migrations/1563804020430-create-erc1155-recipe-history";
import { CreateErc1155CollectionTable1563804020010 } from "./migrations/1563804020010-create-erc1155-collection-table";
import { SeedErc1155Collection1563804020020 } from "./migrations/1563804020020-seed-erc1155-collection";
import { CreateErc1155TokenTable1563804020120 } from "./migrations/1563804020110-create-erc1155-token-table";
import { SeedErc1155Tokens1563804020120 } from "./migrations/1563804020120-seed-erc1155-token";
import { CreateErc1155TokenHistoryTable1563804020130 } from "./migrations/1563804020130-create-erc1155-token-history-table";
import { CreateErc1155MarketplaceHistoryTable1563804020210 } from "./migrations/1563804020210-create-erc1155-marketplace-history-table";
import { CreateErc1155BalanceTable1563804020310 } from "./migrations/1563804020310-create-erc1155-balance-table";
import { SeedErc1155Balance1563804020320 } from "./migrations/1563804020320-seed-erc1155-balance";
import { CreateErc1155Recipe1563804020410 } from "./migrations/1563804020410-create-erc1155-recipe-table";
import { SeedErc1155Recipe1563804020420 } from "./migrations/1563804020420-seed-erc1155-recipe";
import { CreateErc1155Ingredient1563804020510 } from "./migrations/1563804020510-create-erc1155-ingredient-table";
import { SeedErc1155Ingredient1563804020520 } from "./migrations/1563804020520-seed-erc1155-ingredient";
import { CreateErc721AirdropTable1563804040410 } from "./migrations/1563804040410-create-erc721-airdrop-table";
import { SeedErc721Airdrop1563804040420 } from "./migrations/1563804040420-seed-erc721-airdrop";
import { Erc20VestingEntity } from "./erc20/vesting/vesting.entity";
import { CreateErc721Recipe1563804040610 } from "./migrations/1563804040610-create-erc721-recipe-table";
import { SeedErc721Recipe1563804040620 } from "./migrations/1563804040620-seed-erc721-recipe";
import { CreateErc721RecipeHistory1563804040630 } from "./migrations/1563804040630-create-erc721-recipe-history";
import { CreateErc721Ingredient1563804040710 } from "./migrations/1563804040710-create-erc721-ingredient-table";
import { SeedErc721Ingredient1563804040720 } from "./migrations/1563804040720-seed-erc721-ingredient";
import { CreateContractManagerHistoryTable1652682493386 } from "./migrations/1652682493386-create-contract-manager-history-table";
import { AccessControlEntity } from "./blockchain/access-control/access-control.entity";
import { CreateContractManagerTable1652962207600 } from "./migrations/1652962207600-create-contract-manager-table";
import { SeedContractManager1652962207610 } from "./migrations/1652962207610-seed-contract-manager-table";
import { CreateAccessControlTable1653616447230 } from "./migrations/1653616447230-create-access-control-table";
import { CreateAccessControlHistoryTable1653616447240 } from "./migrations/1653616447240-create-access-control-history-table";
import { CreateSeaportTable1653820928940 } from "./migrations/1653820928940-create-seaport-table";
import { CreateSeaportHistoryTable1653820928950 } from "./migrations/1653820928950-create-seaport-history-table";
import { CreateSettingsTable1654437010000 } from "./migrations/1654437010000-create-settings-table";
import { SeedSettingsTable1654437010010 } from "./migrations/1654437010010-seed-settings-table";
import { CreateStakingTable1654751224200 } from "./migrations/1654751224200-create-staking-table";
import { SeedStakingTable1654751224210 } from "./migrations/1654751224210-seed-staking-table";
import { CreateStakingDepositTable1654751224220 } from "./migrations/1654751224220-create-staking-deposit-table";
import { SeedStakingDepositTable1654751224230 } from "./migrations/1654751224230-seed-staking-deposit-table";
import { CreateStakingRewardTable1654751224240 } from "./migrations/1654751224240-create-staking-reward-table";
import { SeedStakingRewardTable1654751224250 } from "./migrations/1654751224250-seed-staking-reward-table";
import { CreateStakingHistoryTable1654751224260 } from "./migrations/1654751224260-create-staking-history-table";
import { PageEntity } from "./page/page.entity";
import { CreatePageTable1655626535100 } from "./migrations/1655626535100-create-page-table";
import { SeedPages1655626535110 } from "./migrations/1655626535110-seed-pages";

// Check typeORM documentation for more information.
const config: PostgresConnectionOptions = {
  name: "default",
  type: "postgres",
  url: process.env.POSTGRES_URL,
  entities: [
    UserEntity,
    OtpEntity,
    SettingsEntity,
    ContractManagerEntity,
    AccessControlEntity,
    Erc20TokenEntity,
    Erc20VestingEntity,
    Erc998CollectionEntity,
    Erc998TemplateEntity,
    Erc998TokenEntity,
    Erc998DropboxEntity,
    Erc998AirdropEntity,
    Erc998RecipeEntity,
    Erc998IngredientEntity,
    Erc721CollectionEntity,
    Erc721TemplateEntity,
    Erc721TokenEntity,
    Erc721DropboxEntity,
    Erc721AirdropEntity,
    Erc721RecipeEntity,
    Erc721IngredientEntity,
    Erc1155CollectionEntity,
    Erc1155TokenEntity,
    Erc1155RecipeEntity,
    Erc1155IngredientEntity,
    StakingEntity,
    StakingDepositEntity,
    StakingRewardEntity,
    StakingHistoryEntity,
    PageEntity,
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
    CreateErc20TokenTable1563804010110,
    SeedErc20Token1563804010120,
    CreateErc20TokenHistoryTable1563804010130,
    CreateErc20VestingTable1563804010210,
    SeedErc20Vesting1563804010220,
    CreateErc20VestingHistoryTable1563804010230,
    CreateErc998CollectionTable1563804030010,
    SeedErc998Collection1563804030020,
    CreateErc998TemplateTable1563804030110,
    SeedErc998Templates1563804030120,
    CreateErc998DropboxTable1563804030210,
    SeedErc998Dropbox1563804030220,
    CreateErc998TokenTable1563804030310,
    SeedErc998Token1563804030320,
    CreateErc998TokenHistoryTable1563804030330,
    CreateErc998MarketplaceHistoryTable1563804030510,
    CreateErc721CollectionTable1563804040010,
    SeedErc721Collection1563804040020,
    CreateErc721TemplateTable1563804040110,
    SeedErc721Templates1563804040120,
    CreateErc721DropboxTable1563804040210,
    SeedErc721Dropbox1563804040220,
    CreateErc721TokenTable1563804040310,
    SeedErc721Token1563804040320,
    CreateErc721TokenHistoryTable1563804040330,
    CreateErc721MarketplaceHistoryTable1563804040510,
    CreateErc721AirdropTable1563804040410,
    SeedErc721Airdrop1563804040420,
    CreateErc721Recipe1563804040610,
    SeedErc721Recipe1563804040620,
    CreateErc721RecipeHistory1563804040630,
    CreateErc721Ingredient1563804040710,
    SeedErc721Ingredient1563804040720,
    CreateErc1155CollectionTable1563804020010,
    SeedErc1155Collection1563804020020,
    CreateErc1155TokenTable1563804020120,
    SeedErc1155Tokens1563804020120,
    CreateErc1155TokenHistoryTable1563804020130,
    CreateErc1155MarketplaceHistoryTable1563804020210,
    CreateErc1155RecipeHistory1563804020430,
    CreateErc1155BalanceTable1563804020310,
    SeedErc1155Balance1563804020320,
    CreateErc1155Recipe1563804020410,
    SeedErc1155Recipe1563804020420,
    CreateErc1155Ingredient1563804020510,
    SeedErc1155Ingredient1563804020520,
    CreateContractManagerHistoryTable1652682493386,
    CreateAccessControlTable1653616447230,
    CreateAccessControlHistoryTable1653616447240,
    CreateSeaportTable1653820928940,
    CreateSeaportHistoryTable1653820928950,
    CreateContractManagerTable1652962207600,
    SeedContractManager1652962207610,
    CreateSettingsTable1654437010000,
    SeedSettingsTable1654437010010,
    CreateStakingTable1654751224200,
    SeedStakingTable1654751224210,
    CreateStakingDepositTable1654751224220,
    SeedStakingDepositTable1654751224230,
    CreateStakingRewardTable1654751224240,
    SeedStakingRewardTable1654751224250,
    CreateStakingHistoryTable1654751224260,
    CreatePageTable1655626535100,
    SeedPages1655626535110,
  ],
};

export default config;
