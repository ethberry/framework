import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

import { EventHistoryEntity } from "./blockchain/event-history/event-history.entity";
import { ClaimEntity } from "./blockchain/mechanics/claim/claim.entity";
import { MysteryBoxEntity } from "./blockchain/mechanics/mystery/box/box.entity";
import { AccessControlEntity } from "./blockchain/extensions/access-control/access-control.entity";
import { StakingRulesEntity } from "./blockchain/mechanics/staking/rules/rules.entity";
import { StakingDepositEntity } from "./blockchain/mechanics/staking/deposit/deposit.entity";
import { TokenEntity } from "./blockchain/hierarchy/token/token.entity";
import { ContractEntity } from "./blockchain/hierarchy/contract/contract.entity";
import { TemplateEntity } from "./blockchain/hierarchy/template/template.entity";
import { AssetEntity } from "./blockchain/exchange/asset/asset.entity";
import { AssetComponentEntity } from "./blockchain/exchange/asset/asset-component.entity";
import { BalanceEntity } from "./blockchain/hierarchy/balance/balance.entity";
import { GradeEntity } from "./blockchain/mechanics/grade/grade.entity";
import { LotteryRoundEntity } from "./blockchain/mechanics/lottery/round/round.entity";
import { LotteryTicketEntity } from "./blockchain/mechanics/lottery/ticket/ticket.entity";
import { CompositionEntity } from "./blockchain/tokens/erc998/composition/composition.entity";
import { OwnershipEntity } from "./blockchain/tokens/erc998/ownership/ownership.entity";
import { AssetComponentHistoryEntity } from "./blockchain/exchange/asset/asset-component-history.entity";
import { AccessListEntity } from "./blockchain/extensions/access-list/access-list.entity";
import { PyramidDepositEntity } from "./blockchain/mechanics/pyramid/deposit/deposit.entity";
import { PyramidRulesEntity } from "./blockchain/mechanics/pyramid/rules/rules.entity";
import { WaitlistListEntity } from "./blockchain/mechanics/waitlist/list/list.entity";
import { WaitlistItemEntity } from "./blockchain/mechanics/waitlist/item/item.entity";
import { BreedEntity } from "./blockchain/mechanics/breed/breed.entity";
import { PayeesEntity } from "./blockchain/extensions/payment-splitter/payee/payees.entity";
import { AchievementItemEntity } from "./achievements/achievement-item.entity";
import { UserEntity } from "./infrastructure/user/user.entity";

// Check typeORM documentation for more information.
const config: PostgresConnectionOptions = {
  name: "default",
  type: "postgres",
  entities: [
    UserEntity,
    // Blockchain
    EventHistoryEntity,
    AccessControlEntity,
    StakingRulesEntity,
    StakingDepositEntity,
    ClaimEntity,
    GradeEntity,
    MysteryBoxEntity,
    ContractEntity,
    TemplateEntity,
    BalanceEntity,
    TokenEntity,
    AssetEntity,
    CompositionEntity,
    OwnershipEntity,
    AccessListEntity,
    AssetComponentEntity,
    AssetComponentHistoryEntity,
    LotteryRoundEntity,
    LotteryTicketEntity,
    PyramidDepositEntity,
    PyramidRulesEntity,
    WaitlistListEntity,
    WaitlistItemEntity,
    BreedEntity,
    PayeesEntity,
    // Achievements
    AchievementItemEntity,
  ],
  synchronize: false,
  namingStrategy: new SnakeNamingStrategy(),
  logging: process.env.NODE_ENV === "development",
};

export default config;
