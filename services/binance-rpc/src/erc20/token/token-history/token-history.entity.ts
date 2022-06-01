import { Column, Entity } from "typeorm";

import { Erc20TokenEventType, IErc20TokenHistory, TErc20TokenEventData } from "@framework/types";
import { ns } from "@framework/constants";
import { IdBaseEntity } from "@gemunion/nest-js-module-typeorm-helpers";

@Entity({ schema: ns, name: "erc20_token_history" })
export class Erc20TokenHistoryEntity extends IdBaseEntity implements IErc20TokenHistory {
  @Column({ type: "varchar" })
  public address: string;

  @Column({ type: "varchar" })
  public transactionHash: string;

  @Column({
    type: "enum",
    enum: Erc20TokenEventType,
  })
  public eventType: Erc20TokenEventType;

  @Column({ type: "json" })
  public eventData: TErc20TokenEventData;
}
