import { Column, Entity } from "typeorm";

import { IAccessControlHistory, AccessControlEventType, TAccessControlEventData } from "@framework/types";
import { ns } from "@framework/constants";
import { IdBaseEntity } from "@gemunion/nest-js-module-typeorm-helpers";

@Entity({ schema: ns, name: "access_control_history" })
export class AccessControlHistoryEntity extends IdBaseEntity implements IAccessControlHistory {
  @Column({ type: "varchar" })
  public address: string;

  @Column({ type: "varchar" })
  public transactionHash: string;

  @Column({
    type: "enum",
    enum: AccessControlEventType,
  })
  public eventType: AccessControlEventType;

  @Column({ type: "json" })
  public eventData: TAccessControlEventData;
}
