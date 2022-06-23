import { Column, Entity } from "typeorm";

import { IStakingRuleHistory, StakingEventType, TStakingEventData } from "@framework/types";
import { ns } from "@framework/constants";
import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-helpers";

@Entity({ schema: ns, name: "staking_history" })
export class StakingHistoryEntity extends IdDateBaseEntity implements IStakingRuleHistory {
  @Column({ type: "varchar" })
  public address: string;

  @Column({ type: "varchar" })
  public transactionHash: string;

  @Column({
    type: "enum",
    enum: StakingEventType,
  })
  public eventType: StakingEventType;

  @Column({ type: "json" })
  public eventData: TStakingEventData;
}
