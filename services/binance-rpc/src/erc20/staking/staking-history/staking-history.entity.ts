import { Column, Entity } from "typeorm";

import { Erc20StakingEventType, IErc20StakingHistory, TErc20StakingEventData } from "@framework/types";
import { ns } from "@framework/constants";
import { IdBaseEntity } from "@gemunion/nest-js-module-typeorm-helpers";

@Entity({ schema: ns, name: "erc20_staking_history" })
export class Erc20StakingHistoryEntity extends IdBaseEntity implements IErc20StakingHistory {
  @Column({ type: "varchar" })
  public address: string;

  @Column({ type: "varchar" })
  public transactionHash: string;

  @Column({
    type: "enum",
    enum: Erc20StakingEventType,
  })
  public eventType: Erc20StakingEventType;

  @Column({ type: "json" })
  public eventData: TErc20StakingEventData;
}
