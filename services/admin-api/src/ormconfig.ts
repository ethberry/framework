import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

import { ns } from "@framework/constants";
import {
  createDomainUint256,
  createLanguageEnum,
  createOpenZeppelin,
  createSchema,
  installExtensionUUID,
} from "@gemunion/nest-js-module-typeorm-helpers";

import { UserEntity } from "./user/user.entity";
import { OtpEntity } from "./otp/otp.entity";
import { Erc20TokenEntity } from "./erc20/token/token.entity";
import { Erc721CollectionEntity } from "./erc721/collection/collection.entity";
import { Erc721TemplateEntity } from "./erc721/template/template.entity";
import { Erc721TokenEntity } from "./erc721/token/token.entity";
import { Erc721DropboxEntity } from "./erc721/dropbox/dropbox.entity";
import { Erc721AuctionEntity } from "./erc721/auction/auction.entity";
import { Erc721AirdropEntity } from "./erc721/airdrop/airdrop.entity";
import { Erc721RecipeEntity } from "./erc721/recipe/recipe.entity";
import { Erc721IngredientEntity } from "./erc721/ingredient/ingredient.entity";
import { Erc1155CollectionEntity } from "./erc1155/collection/collection.entity";
import { Erc1155TokenEntity } from "./erc1155/token/token.entity";
import { Erc1155RecipeEntity } from "./erc1155/recipe/recipe.entity";
import { Erc1155IngredientEntity } from "./erc1155/ingredient/ingredient.entity";

import { CreateUserTable1563804021040 } from "./migrations/1563804021040-create-user-table";
import { SeedUser1563804021050 } from "./migrations/1563804021050-seed-user";
import { CreateOtpTable1563804021060 } from "./migrations/1563804021060-create-otp-table";
import { CreateErc20TokenTable1563804021100 } from "./migrations/1563804021100-create-erc20-token-table";
import { SeedErc20Token1563804021110 } from "./migrations/1563804021110-seed-erc20-tokens";
import { CreateErc20TokenHistoryTable1563804021120 } from "./migrations/1563804021120-create-erc20-token-history-table";
import { CreateErc20VestingTable1563804021115 } from "./migrations/1563804021115-create-erc20-vesting-table";
import { SeedErc20Vesting1563804021116 } from "./migrations/1563804021116-seed-erc20-vesting";
import { CreateErc20VestingHistoryTable1563804021117 } from "./migrations/1563804021117-create-erc20-vesting-history-table";
import { CreateErc20StakingHistoryTable1563804021130 } from "./migrations/1563804021130-create-erc20-staking-history-table";
import { CreateErc721CollectionTable1563804021240 } from "./migrations/1563804021240-create-erc721-collection-table";
import { SeedErc721Collection1563804021250 } from "./migrations/1563804021250-seed-erc721-collection";
import { CreateErc721TemplateTable1563804021260 } from "./migrations/1563804021260-create-erc721-template-table";
import { SeedErc721Templates1563804021270 } from "./migrations/1563804021270-seed-erc721-template";
import { CreateErc721DropboxTable1563804021275 } from "./migrations/1563804021275-create-erc721-dropbox-table";
import { SeedErc721Dropbox1563804021276 } from "./migrations/1563804021276-seed-erc721-dropbox";
import { CreateErc721TokenTable1563804021280 } from "./migrations/1563804021280-create-erc721-token-table";
import { SeedErc721Token1563804021281 } from "./migrations/1563804021281-seed-erc721-tokens";
import { CreateErc721TokenHistoryTable1563804021290 } from "./migrations/1563804021290-create-erc721-token-history-table";
import { CreateErc721MarketplaceHistoryTable1563804021300 } from "./migrations/1563804021300-create-erc721-marketplace-history-table";
import { CreateErc1155RecipeHistory1645160381140 } from "./migrations/1645160381140-create-erc1155-recipe-history";
import { CreateErc1155CollectionTable1641526822350 } from "./migrations/1641526822350-create-erc1155-collection-table";
import { SeedErc1155Collection1641526822360 } from "./migrations/1641526822360-seed-erc1155-collection";
import { CreateErc1155TokenTable1641526822370 } from "./migrations/1641526822370-create-erc1155-token-table";
import { SeedErc1155Tokens1641526822380 } from "./migrations/1641526822380-seed-erc1155-token";
import { CreateErc1155TokenHistoryTable1641526822390 } from "./migrations/1641526822390-create-erc1155-token-history-table";
import { CreateErc1155MarketplaceHistoryTable1641526822391 } from "./migrations/1641526822391-create-erc1155-marketplace-history-table";
import { CreateErc1155BalanceTable1644208366000 } from "./migrations/1644208366000-create-erc1155-balance-table";
import { SeedErc1155Balance1644208366010 } from "./migrations/1644208366010-seed-erc1155-balance";
import { CreateErc1155Recipe1645160381120 } from "./migrations/1645160381120-create-erc1155-recipe-table";
import { SeedErc1155Recipe1645160381130 } from "./migrations/1645160381130-seed-erc1155-recipe";
import { CreateErc1155Ingredient1645161089530 } from "./migrations/1645161089530-create-erc1155-ingredient-table";
import { SeedErc1155Ingredient1645161089540 } from "./migrations/1645161089540-seed-erc1155-ingredient";
import { CreateErc721AuctionTable1646924902900 } from "./migrations/1646924902900-create-erc721-auction-table";
import { CreateErc721AuctionHistoryTable1646924902920 } from "./migrations/1646924902920-create-erc721-auction-history-table";
import { CreateErc721AirdropTable1648525967810 } from "./migrations/1648525967800-create-erc721-airdrop-table";
import { SeedErc721Airdrop1648525967820 } from "./migrations/1648525967820-seed-erc721-airdrop";
import { Erc20StakingHistoryEntity } from "./erc20/staking-history/staking-history.entity";
import { Erc20VestingEntity } from "./erc20/vesting/vesting.entity";
import { CreateErc721Recipe1648525970000 } from "./migrations/1648525970000-create-erc721-recipe-table";
import { SeedErc721Recipe1648525970010 } from "./migrations/1648525970010-seed-erc721-recipe";
import { CreateErc721RecipeHistory1648525970020 } from "./migrations/1648525970020-create-erc721-recipe-history";
import { CreateErc721Ingredient1648525970030 } from "./migrations/1648525970030-create-erc721-ingredient-table";
import { SeedErc721Ingredient1648525970040 } from "./migrations/1648525970040-seed-erc721-ingredient";

// Check typeORM documentation for more information.
const config: PostgresConnectionOptions = {
  name: "default",
  type: "postgres",
  url: process.env.POSTGRES_URL,
  entities: [
    UserEntity,
    OtpEntity,
    Erc20TokenEntity,
    Erc20VestingEntity,
    Erc20StakingHistoryEntity,
    Erc721CollectionEntity,
    Erc721TemplateEntity,
    Erc721TokenEntity,
    Erc721DropboxEntity,
    Erc721AirdropEntity,
    Erc721AuctionEntity,
    Erc721RecipeEntity,
    Erc721IngredientEntity,
    Erc1155CollectionEntity,
    Erc1155TokenEntity,
    Erc1155RecipeEntity,
    Erc1155IngredientEntity,
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
    createOpenZeppelin(ns),
    CreateUserTable1563804021040,
    SeedUser1563804021050,
    CreateOtpTable1563804021060,
    CreateErc20TokenTable1563804021100,
    SeedErc20Token1563804021110,
    CreateErc20TokenHistoryTable1563804021120,
    CreateErc20VestingTable1563804021115,
    SeedErc20Vesting1563804021116,
    CreateErc20VestingHistoryTable1563804021117,
    CreateErc20StakingHistoryTable1563804021130,
    CreateErc721CollectionTable1563804021240,
    SeedErc721Collection1563804021250,
    CreateErc721TemplateTable1563804021260,
    SeedErc721Templates1563804021270,
    CreateErc721DropboxTable1563804021275,
    SeedErc721Dropbox1563804021276,
    CreateErc721TokenTable1563804021280,
    SeedErc721Token1563804021281,
    CreateErc721TokenHistoryTable1563804021290,
    CreateErc721MarketplaceHistoryTable1563804021300,
    CreateErc1155CollectionTable1641526822350,
    SeedErc1155Collection1641526822360,
    CreateErc1155TokenTable1641526822370,
    SeedErc1155Tokens1641526822380,
    CreateErc1155TokenHistoryTable1641526822390,
    CreateErc1155MarketplaceHistoryTable1641526822391,
    CreateErc1155RecipeHistory1645160381140,
    CreateErc1155BalanceTable1644208366000,
    SeedErc1155Balance1644208366010,
    CreateErc1155Recipe1645160381120,
    SeedErc1155Recipe1645160381130,
    CreateErc1155Ingredient1645161089530,
    SeedErc1155Ingredient1645161089540,
    CreateErc721AuctionTable1646924902900,
    CreateErc721AuctionHistoryTable1646924902920,
    CreateErc721AirdropTable1648525967810,
    SeedErc721Airdrop1648525967820,
    CreateErc721Recipe1648525970000,
    SeedErc721Recipe1648525970010,
    CreateErc721RecipeHistory1648525970020,
    CreateErc721Ingredient1648525970030,
    SeedErc721Ingredient1648525970040,
  ],
};

export default config;
