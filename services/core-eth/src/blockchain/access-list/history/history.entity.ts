import { Column, Entity } from "typeorm";

import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-helpers";
import { AccessListEventType, IAccessListHistory, TAccessListEventData } from "@framework/types";
import { ns } from "@framework/constants";

@Entity({ schema: ns, name: "access_list_history" })
export class AccessListHistoryEntity extends IdDateBaseEntity implements IAccessListHistory {
  @Column({ type: "varchar" })
  public address: string;

  @Column({ type: "varchar" })
  public transactionHash: string;

  @Column({
    type: "enum",
    enum: AccessListEventType,
  })
  public eventType: AccessListEventType;

  @Column({ type: "json" })
  public eventData: TAccessListEventData;
}
