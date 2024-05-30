import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

import { AssetComponentEntity } from "./blockchain/exchange/asset/asset-component.entity";
import { AssetEntity } from "./blockchain/exchange/asset/asset.entity";
import { BalanceEntity } from "./blockchain/hierarchy/balance/balance.entity";
import { ClaimEntity } from "./blockchain/mechanics/marketing/claim/claim.entity";
import { LootBoxEntity } from "./blockchain/mechanics/marketing/loot/box/box.entity";
import { MysteryBoxEntity } from "./blockchain/mechanics/marketing/mystery/box/box.entity";
import { ContractEntity } from "./blockchain/hierarchy/contract/contract.entity";
import { MerchantEntity } from "./infrastructure/merchant/merchant.entity";
import { SettingsEntity } from "./infrastructure/settings/settings.entity";
import { TemplateEntity } from "./blockchain/hierarchy/template/template.entity";
import { TokenEntity } from "./blockchain/hierarchy/token/token.entity";
import { UserEntity } from "./infrastructure/user/user.entity";
import { ChainLinkSubscriptionEntity } from "./blockchain/integrations/chain-link/subscription/subscription.entity";
import { PredictionAnswerEntity } from "./blockchain/mechanics/gambling/prediction/answer/answer.entity";
import { PredictionQuestionEntity } from "./blockchain/mechanics/gambling/prediction/question/question.entity";
import { RaffleRoundEntity } from "./blockchain/mechanics/gambling/raffle/round/round.entity";

// Check typeORM documentation for more information.
const config: PostgresConnectionOptions = {
  name: "default",
  type: "postgres",
  entities: [
    AssetComponentEntity,
    AssetEntity,
    BalanceEntity,
    ClaimEntity,
    ContractEntity,
    MerchantEntity,
    SettingsEntity,
    TemplateEntity,
    TokenEntity,
    UserEntity,
    ChainLinkSubscriptionEntity,
    RaffleRoundEntity,
    LootBoxEntity,
    MysteryBoxEntity,

    PredictionAnswerEntity,
    PredictionQuestionEntity,
  ],
  synchronize: false,
  namingStrategy: new SnakeNamingStrategy(),
  logging: process.env.LOG_MODE === "true",
};

export default config;
