import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

import {
  ContractManagerHistoryEntity
} from "./blockchain/contract-manager/contract-manager-history/contract-manager-history.entity";
import { ContractManagerEntity } from "./blockchain/contract-manager/contract-manager.entity";
import { Erc20TokenHistoryEntity } from "./erc20/token/token-history/token-history.entity";
import { UniTemplateEntity } from "./erc20/token/token.entity";
import { Erc20VestingEntity } from "./vesting/vesting/vesting.entity";
import { UniContractEntity } from "./erc721/collection/collection.entity";
import { UniTokenEntity } from "./erc721/token/token.entity";
import { Erc721TokenHistoryEntity } from "./erc721/token/token-history/token-history.entity";
import { Erc721MarketplaceHistoryEntity } from "./erc721/marketplace/marketplace-history/marketplace-history.entity";
import { UniTemplateEntity } from "./erc721/template/template.entity";
import { Erc721AirdropEntity } from "./erc721/airdrop/airdrop.entity";
import { Erc721DropboxEntity } from "./erc721/dropbox/dropbox.entity";
import { CraftEntity } from "./erc721/recipe/recipe.entity";
import { Erc721RecipeHistoryEntity } from "./erc721/recipe/recipe-history/recipe-history.entity";
import { Erc721IngredientEntity } from "./erc721/ingredient/ingredient.entity";
import { UniContractEntity } from "./erc1155/collection/collection.entity";
import { UniTemplateEntity } from "./erc1155/token/token.entity";
import { Erc1155TokenHistoryEntity } from "./erc1155/token/token-history/token-history.entity";
import { Erc1155MarketplaceHistoryEntity } from "./erc1155/marketplace/marketplace-history/marketplace-history.entity";
import { Erc1155RecipeEntity } from "./erc1155/recipe/recipe.entity";
import { Erc1155RecipeHistoryEntity } from "./erc1155/recipe/recipe-history/recipe-history.entity";
import { Erc1155IngredientEntity } from "./erc1155/ingredient/ingredient.entity";
import { Erc1155BalanceEntity } from "./erc1155/balance/balance.entity";
import { AccessControlEntity } from "./blockchain/access-control/access-control.entity";
import {
  AccessControlHistoryEntity
} from "./blockchain/access-control/access-control-history/access-control-history.entity";
import { StakingHistoryEntity } from "./blockchain/staking/staking-history/staking-history.entity";
import { StakingEntity } from "./blockchain/staking/staking.entity";
import { StakingDepositEntity } from "./blockchain/staking/staking.deposit.entity";
import { StakingRewardEntity } from "./blockchain/staking/staking.reward.entity";
import { StakesEntity } from "./blockchain/staking/stakes/stakes.entity";

// Check typeORM documentation for more information.
const config: PostgresConnectionOptions = {
  name: "default",
  type: "postgres",
  entities: [
    ContractManagerEntity,
    ContractManagerHistoryEntity,
    AccessControlEntity,
    AccessControlHistoryEntity,
    Erc20TokenHistoryEntity,
    UniTemplateEntity,
    Erc20VestingEntity,
    StakingEntity,
    StakesEntity,
    StakingDepositEntity,
    StakingRewardEntity,
    StakingHistoryEntity,
    UniContractEntity,
    UniTemplateEntity,
    UniTokenEntity,
    Erc721TokenHistoryEntity,
    Erc721MarketplaceHistoryEntity,
    Erc721AirdropEntity,
    Erc721DropboxEntity,
    CraftEntity,
    Erc721RecipeHistoryEntity,
    Erc721IngredientEntity,
    UniContractEntity,
    UniTemplateEntity,
    Erc1155RecipeEntity,
    Erc1155RecipeHistoryEntity,
    Erc1155IngredientEntity,
    Erc1155TokenHistoryEntity,
    Erc1155MarketplaceHistoryEntity,
    Erc1155BalanceEntity,
  ],
  synchronize: false,
  namingStrategy: new SnakeNamingStrategy(),
  logging: process.env.NODE_ENV === "development",
};

export default config;
