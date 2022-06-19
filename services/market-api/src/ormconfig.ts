import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

import { UserEntity } from "./user/user.entity";
import { Erc20TokenEntity } from "./erc20/token/token.entity";
import { Erc20VestingEntity } from "./erc20/vesting/vesting.entity";
import { Erc721CollectionEntity } from "./erc721/collection/collection.entity";
import { Erc721TemplateEntity } from "./erc721/template/template.entity";
import { Erc721DropboxEntity } from "./erc721/dropbox/dropbox.entity";
import { Erc721AirdropEntity } from "./erc721/airdrop/airdrop.entity";
import { Erc721TokenEntity } from "./erc721/token/token.entity";
import { Erc721TokenHistoryEntity } from "./erc721/token/token-history/token-history.entity";
import { Erc721RecipeEntity } from "./erc721/recipe/recipe.entity";
import { Erc721IngredientEntity } from "./erc721/recipe/ingredient/ingredient.entity";
import { Erc998CollectionEntity } from "./erc998/collection/collection.entity";
import { Erc998TemplateEntity } from "./erc998/template/template.entity";
import { Erc998DropboxEntity } from "./erc998/dropbox/dropbox.entity";
import { Erc998AirdropEntity } from "./erc998/airdrop/airdrop.entity";
import { Erc998TokenEntity } from "./erc998/token/token.entity";
import { Erc998TokenHistoryEntity } from "./erc998/token/token-history/token-history.entity";
import { Erc998RecipeEntity } from "./erc998/recipe/recipe.entity";
import { Erc998IngredientEntity } from "./erc998/recipe/ingredient/ingredient.entity";
import { Erc1155CollectionEntity } from "./erc1155/collection/collection.entity";
import { Erc1155TokenEntity } from "./erc1155/token/token.entity";
import { Erc1155BalanceEntity } from "./erc1155/balance/balance.entity";
import { Erc1155TokenHistoryEntity } from "./erc1155/token-history/token-history.entity";
import { Erc1155RecipeEntity } from "./erc1155/recipe/recipe.entity";
import { Erc1155IngredientEntity } from "./erc1155/recipe/ingredient/ingredient.entity";
import { StakingEntity } from "./blockchain/staking/staking.entity";
import { StakingDepositEntity } from "./blockchain/staking/staking.deposit.entity";
import { StakingRewardEntity } from "./blockchain/staking/staking.reward.entity";
import { PageEntity } from "./page/page.entity";

// Check typeORM documentation for more information.
const config: PostgresConnectionOptions = {
  name: "default",
  type: "postgres",
  entities: [
    Erc20TokenEntity,
    Erc20VestingEntity,
    Erc721CollectionEntity,
    Erc721TemplateEntity,
    Erc721DropboxEntity,
    Erc721AirdropEntity,
    Erc721TokenEntity,
    Erc721TokenHistoryEntity,
    Erc721TemplateEntity,
    Erc721CollectionEntity,
    Erc721RecipeEntity,
    Erc721IngredientEntity,
    Erc998CollectionEntity,
    Erc998TemplateEntity,
    Erc998DropboxEntity,
    Erc998AirdropEntity,
    Erc998TokenEntity,
    Erc998TokenHistoryEntity,
    Erc998TemplateEntity,
    Erc998CollectionEntity,
    Erc998RecipeEntity,
    Erc998IngredientEntity,
    Erc1155CollectionEntity,
    Erc1155TokenEntity,
    Erc1155BalanceEntity,
    Erc1155TokenHistoryEntity,
    Erc1155RecipeEntity,
    Erc1155IngredientEntity,
    UserEntity,
    StakingEntity,
    StakingDepositEntity,
    StakingRewardEntity,
    PageEntity,
  ],
  synchronize: false,
  namingStrategy: new SnakeNamingStrategy(),
  logging: process.env.NODE_ENV === "development",
};

export default config;
