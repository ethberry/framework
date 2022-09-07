import { Column, Entity } from "typeorm";

import { ns } from "@framework/constants";
import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-postgres";
import { ILotteryHistory, LotteryEventType, TLotteryEventData } from "@framework/types";

@Entity({ schema: ns, name: "lottery_history" })
export class LotteryHistoryEntity extends IdDateBaseEntity implements ILotteryHistory {
  @Column({ type: "varchar" })
  public address: string;

  @Column({ type: "varchar" })
  public transactionHash: string;

  @Column({
    type: "enum",
    enum: LotteryEventType,
  })
  public eventType: LotteryEventType;

  @Column({ type: "json" })
  public eventData: TLotteryEventData;
}
