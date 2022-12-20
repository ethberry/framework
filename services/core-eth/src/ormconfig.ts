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
import { StakingDepositEntity } from "./blockchain/mechanics/staking/deposit/deposit.entity";
import { ExchangeHistoryEntity } from "./blockchain/exchange/history/history.entity";
import { TokenEntity } from "./blockchain/hierarchy/token/token.entity";
import { ContractEntity } from "./blockchain/hierarchy/contract/contract.entity";
import { TemplateEntity } from "./blockchain/hierarchy/template/template.entity";
import { AssetEntity } from "./blockchain/exchange/asset/asset.entity";
import { AssetComponentEntity } from "./blockchain/exchange/asset/asset-component.entity";
import { BalanceEntity } from "./blockchain/hierarchy/balance/balance.entity";
import { GradeEntity } from "./blockchain/mechanics/grade/grade.entity";
import { LotteryRoundEntity } from "./blockchain/mechanics/lottery/round/round.entity";
import { LotteryTicketEntity } from "./blockchain/mechanics/lottery/ticket/ticket.entity";
import { LotteryHistoryEntity } from "./blockchain/mechanics/lottery/history/history.entity";
import { CompositionEntity } from "./blockchain/tokens/erc998/composition/composition.entity";
import { OwnershipEntity } from "./blockchain/tokens/erc998/ownership/ownership.entity";
import { AssetComponentHistoryEntity } from "./blockchain/exchange/asset/asset-component-history.entity";
import { AccessListHistoryEntity } from "./blockchain/access-list/history/history.entity";
import { AccessListEntity } from "./blockchain/access-list/access-list.entity";
import { PyramidHistoryEntity } from "./blockchain/mechanics/pyramid/history/history.entity";
import { PyramidDepositEntity } from "./blockchain/mechanics/pyramid/deposit/deposit.entity";
import { PyramidRulesEntity } from "./blockchain/mechanics/pyramid/rules/rules.entity";
import { WaitlistListEntity } from "./blockchain/mechanics/waitlist/list/list.entity";
import { WaitlistItemEntity } from "./blockchain/mechanics/waitlist/item/item.entity";
import { BreedEntity } from "./blockchain/mechanics/breed/breed.entity";
import { BreedHistoryEntity } from "./blockchain/mechanics/breed/history/history.entity";
import { PayeesEntity } from "./blockchain/wallet/payees.entity";
import { VestingHistoryEntity } from "./blockchain/mechanics/vesting/history/vesting-history.entity";

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
    VestingHistoryEntity,
    StakingRulesEntity,
    StakingDepositEntity,
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
    PyramidDepositEntity,
    PyramidRulesEntity,
    WaitlistListEntity,
    WaitlistItemEntity,
    BreedEntity,
    BreedHistoryEntity,
    PayeesEntity,
  ],
  synchronize: false,
  namingStrategy: new SnakeNamingStrategy(),
  logging: process.env.NODE_ENV === "development",
};

export default config;
