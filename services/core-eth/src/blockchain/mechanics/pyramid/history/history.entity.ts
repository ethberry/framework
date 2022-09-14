import { Column, Entity } from "typeorm";

import { IPyramidHistory, PyramidEventType, TPyramidEventData } from "@framework/types";
import { ns } from "@framework/constants";
import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-postgres";

@Entity({ schema: ns, name: "pyramid_history" })
export class PyramidHistoryEntity extends IdDateBaseEntity implements IPyramidHistory {
  @Column({ type: "varchar" })
  public address: string;

  @Column({ type: "varchar" })
  public transactionHash: string;

  @Column({
    type: "enum",
    enum: PyramidEventType,
  })
  public eventType: PyramidEventType;

  @Column({ type: "json" })
  public eventData: TPyramidEventData;
}
