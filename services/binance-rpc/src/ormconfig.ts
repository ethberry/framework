import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

import { ContractManagerHistoryEntity } from "./contract-manager-history/contract-manager-history.entity";
import { Erc20TokenHistoryEntity } from "./erc20/token-history/token-history.entity";
import { Erc20TokenEntity } from "./erc20/token/token.entity";
import { Erc20VestingEntity } from "./vesting/vesting/vesting.entity";
import { Erc20StakingModule } from "./erc20/staking/staking.module";
import { Erc721CollectionEntity } from "./erc721/collection/collection.entity";
import { Erc721TokenEntity } from "./erc721/token/token.entity";
import { Erc721TokenHistoryEntity } from "./erc721/token-history/token-history.entity";
import { Erc721MarketplaceHistoryEntity } from "./erc721/marketplace-history/marketplace-history.entity";
import { Erc721TemplateEntity } from "./erc721/template/template.entity";
import { Erc721AirdropEntity } from "./erc721/airdrop/airdrop.entity";
import { Erc721DropboxEntity } from "./erc721/dropbox/dropbox.entity";
import { Erc721RecipeEntity } from "./erc721/recipe/recipe.entity";
import { Erc721RecipeHistoryEntity } from "./erc721/recipe-history/recipe-history.entity";
import { Erc721IngredientEntity } from "./erc721/ingredient/ingredient.entity";

import { Erc1155CollectionEntity } from "./erc1155/collection/collection.entity";
import { Erc1155TokenEntity } from "./erc1155/token/token.entity";
import { Erc1155TokenHistoryEntity } from "./erc1155/token-history/token-history.entity";
import { Erc1155MarketplaceHistoryEntity } from "./erc1155/marketplace-history/marketplace-history.entity";
import { Erc1155RecipeEntity } from "./erc1155/recipe/recipe.entity";
import { Erc1155RecipeHistoryEntity } from "./erc1155/recipe-history/recipe-history.entity";
import { Erc1155IngredientEntity } from "./erc1155/ingredient/ingredient.entity";
import { Erc1155BalanceEntity } from "./erc1155/balance/balance.entity";
import { ContractManagerEntity } from "./contract-manager/contract-manager.entity";

// Check typeORM documentation for more information.
const config: PostgresConnectionOptions = {
  name: "default",
  type: "postgres",
  entities: [
    ContractManagerHistoryEntity,
    Erc20TokenHistoryEntity,
    Erc20TokenEntity,
    Erc20VestingEntity,
    Erc20StakingModule,
    Erc721CollectionEntity,
    Erc721TemplateEntity,
    Erc721TokenEntity,
    Erc721TokenHistoryEntity,
    Erc721MarketplaceHistoryEntity,
    Erc721AirdropEntity,
    Erc721DropboxEntity,
    Erc721RecipeEntity,
    Erc721RecipeHistoryEntity,
    Erc721IngredientEntity,
    Erc1155CollectionEntity,
    Erc1155TokenEntity,
    Erc1155RecipeEntity,
    Erc1155RecipeHistoryEntity,
    Erc1155IngredientEntity,
    Erc1155TokenHistoryEntity,
    Erc1155MarketplaceHistoryEntity,
    Erc1155BalanceEntity,
    ContractManagerEntity,
  ],
  synchronize: false,
  namingStrategy: new SnakeNamingStrategy(),
  logging: process.env.NODE_ENV === "development",
};

export default config;
