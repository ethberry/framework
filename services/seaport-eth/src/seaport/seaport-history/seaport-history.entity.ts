import { Column, Entity } from "typeorm";

import { ns } from "@framework/constants";
import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-helpers";

import { ISeaportHistory, SeaportEventType, TSeaportEventData } from "./interfaces";

@Entity({ schema: ns, name: "seaport_history" })
export class SeaportHistoryEntity extends IdDateBaseEntity implements ISeaportHistory {
  @Column({ type: "varchar" })
  public address: string;

  @Column({ type: "varchar" })
  public transactionHash: string;

  @Column({
    type: "enum",
    enum: SeaportEventType,
  })
  public eventType: SeaportEventType;

  @Column({ type: "json" })
  public eventData: TSeaportEventData;
}
