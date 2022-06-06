import { Column, Entity } from "typeorm";

import { Erc20VestingEventType, IErc20VestingHistory, TErc20VestingEventData } from "@framework/types";
import { ns } from "@framework/constants";
import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-helpers";

@Entity({ schema: ns, name: "erc20_vesting_history" })
export class Erc20VestingHistoryEntity extends IdDateBaseEntity implements IErc20VestingHistory {
  @Column({ type: "varchar" })
  public address: string;

  @Column({ type: "varchar" })
  public transactionHash: string;

  @Column({
    type: "enum",
    enum: Erc20VestingEventType,
  })
  public eventType: Erc20VestingEventType;

  @Column({ type: "json" })
  public eventData: TErc20VestingEventData;
}
