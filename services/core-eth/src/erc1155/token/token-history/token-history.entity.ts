import { Column, Entity } from "typeorm";

import { Erc1155TokenEventType, IErc1155TokenHistory, TErc1155TokenEventData } from "@framework/types";
import { ns } from "@framework/constants";
import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-helpers";

@Entity({ schema: ns, name: "erc1155_token_history" })
export class Erc1155TokenHistoryEntity extends IdDateBaseEntity implements IErc1155TokenHistory {
  @Column({ type: "varchar" })
  public address: string;

  @Column({ type: "varchar" })
  public transactionHash: string;

  @Column({
    type: "enum",
    enum: Erc1155TokenEventType,
  })
  public eventType: Erc1155TokenEventType;

  @Column({ type: "json" })
  public eventData: TErc1155TokenEventData;
}
