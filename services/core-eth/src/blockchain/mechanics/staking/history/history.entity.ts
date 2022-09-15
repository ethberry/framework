import { Column, Entity } from "typeorm";

import { IStakingHistory, StakingEventType, TStakingEventData } from "@framework/types";
import { ns } from "@framework/constants";
import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-postgres";

@Entity({ schema: ns, name: "staking_deposit_history" })
export class StakingHistoryEntity extends IdDateBaseEntity implements IStakingHistory {
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
