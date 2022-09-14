import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

import { ContractManagerHistoryEntity } from "./blockchain/contract-manager/history/history.entity";
import { ContractHistoryEntity } from "./blockchain/contract-history/contract-history.entity";
import { VestingEntity } from "./blockchain/mechanics/vesting/vesting.entity";
import { ClaimEntity } from "./blockchain/mechanics/claim/claim.entity";
import { MysteryBoxEntity } from "./blockchain/mechanics/mystery/box/box.entity";
import { AccessControlEntity } from "./blockchain/access-control/access-control.entity";
import { AccessControlHistoryEntity } from "./blockchain/access-control/history/history.entity";
import { StakingHistoryEntity } from "./blockchain/mechanics/staking/history/history.entity";
import { StakingRulesEntity } from "./blockchain/mechanics/staking/rules/rules.entity";
import { StakingStakesEntity } from "./blockchain/mechanics/staking/stakes/stakes.entity";
import { ExchangeHistoryEntity } from "./blockchain/mechanics/exchange/history/exchange-history.entity";
import { TokenEntity } from "./blockchain/hierarchy/token/token.entity";
import { ContractEntity } from "./blockchain/hierarchy/contract/contract.entity";
import { TemplateEntity } from "./blockchain/hierarchy/template/template.entity";
import { AssetEntity } from "./blockchain/mechanics/asset/asset.entity";
import { AssetComponentEntity } from "./blockchain/mechanics/asset/asset-component.entity";
import { BalanceEntity } from "./blockchain/hierarchy/balance/balance.entity";
import { GradeEntity } from "./blockchain/mechanics/grade/grade.entity";
import { LotteryRoundEntity } from "./blockchain/mechanics/lottery/round/round.entity";
import { LotteryTicketEntity } from "./blockchain/mechanics/lottery/ticket/ticket.entity";
import { LotteryHistoryEntity } from "./blockchain/mechanics/lottery/history/history.entity";
import { CompositionEntity } from "./blockchain/tokens/erc998/composition/composition.entity";
import { OwnershipEntity } from "./blockchain/tokens/erc998/ownership/ownership.entity";
import { AssetComponentHistoryEntity } from "./blockchain/mechanics/asset/asset-component-history.entity";
import { AccessListHistoryEntity } from "./blockchain/access-list/history/history.entity";
import { AccessListEntity } from "./blockchain/access-list/access-list.entity";
import { PyramidHistoryEntity } from "./blockchain/mechanics/pyramid/history/history.entity";
import { PyramidStakesEntity } from "./blockchain/mechanics/pyramid/stakes/stakes.entity";
import { PyramidRulesEntity } from "./blockchain/mechanics/pyramid/rules/rules.entity";

// Check typeORM documentation for more information.
const config: PostgresConnectionOptions = {
  name: "default",
  type: "postgres",
  entities: [
    ContractManagerHistoryEntity,
    AccessListHistoryEntity,
    AccessControlEntity,
    AccessControlHistoryEntity,
    ContractHistoryEntity,
    VestingEntity,
    StakingRulesEntity,
    StakingStakesEntity,
    StakingHistoryEntity,
    ClaimEntity,
    GradeEntity,
    MysteryBoxEntity,
    ExchangeHistoryEntity,
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
    LotteryHistoryEntity,
    PyramidHistoryEntity,
    PyramidStakesEntity,
    PyramidRulesEntity,
  ],
  synchronize: false,
  namingStrategy: new SnakeNamingStrategy(),
  logging: process.env.NODE_ENV === "development",
};

export default config;
