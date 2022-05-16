import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

import { UserEntity } from "./user/user.entity";
import { Erc20VestingEntity } from "./erc20/vesting/vesting.entity";
import { Erc721CollectionEntity } from "./erc721/collection/collection.entity";
import { Erc721TemplateEntity } from "./erc721/template/template.entity";
import { Erc721DropboxEntity } from "./erc721/dropbox/dropbox.entity";
import { Erc721AirdropEntity } from "./erc721/airdrop/airdrop.entity";
import { Erc721TokenEntity } from "./erc721/token/token.entity";
import { Erc721TokenHistoryEntity } from "./erc721/token-history/token-history.entity";
import { Erc721AuctionEntity } from "./erc721/auction/auction.entity";
import { Erc721AuctionHistoryEntity } from "./erc721/auction-history/auction-history.entity";
import { Erc1155CollectionEntity } from "./erc1155/collection/collection.entity";
import { Erc1155TokenEntity } from "./erc1155/token/token.entity";
import { Erc1155BalanceEntity } from "./erc1155/balance/balance.entity";
import { Erc1155TokenHistoryEntity } from "./erc1155/token-history/token-history.entity";
import { Erc1155RecipeEntity } from "./erc1155/recipe/recipe.entity";
import { Erc1155IngredientEntity } from "./erc1155/ingredient/ingredient.entity";

// Check typeORM documentation for more information.
const config: PostgresConnectionOptions = {
  name: "default",
  type: "postgres",
  entities: [
    Erc20VestingEntity,
    Erc721CollectionEntity,
    Erc721TemplateEntity,
    Erc721DropboxEntity,
    Erc721AirdropEntity,
    Erc721TokenEntity,
    Erc721TokenHistoryEntity,
    Erc721TemplateEntity,
    Erc721CollectionEntity,
    Erc721AuctionEntity,
    Erc721AuctionHistoryEntity,
    Erc1155CollectionEntity,
    Erc1155TokenEntity,
    Erc1155BalanceEntity,
    Erc1155TokenHistoryEntity,
    Erc1155RecipeEntity,
    Erc1155IngredientEntity,
    UserEntity,
  ],
  synchronize: false,
  namingStrategy: new SnakeNamingStrategy(),
  logging: process.env.NODE_ENV === "development",
};

export default config;
