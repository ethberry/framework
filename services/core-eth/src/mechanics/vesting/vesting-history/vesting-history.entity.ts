import { Column, Entity } from "typeorm";

import { VestingEventType, IVestingHistory, TVestingEventData } from "@framework/types";
import { ns } from "@framework/constants";
import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-helpers";

@Entity({ schema: ns, name: "vesting_history" })
export class VestingHistoryEntity extends IdDateBaseEntity implements IVestingHistory {
  @Column({ type: "varchar" })
  public address: string;

  @Column({ type: "varchar" })
  public transactionHash: string;

  @Column({
    type: "enum",
    enum: VestingEventType,
  })
  public eventType: VestingEventType;

  @Column({ type: "json" })
  public eventData: TVestingEventData;
}
