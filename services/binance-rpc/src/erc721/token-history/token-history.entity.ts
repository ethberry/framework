import { Column, Entity } from "typeorm";

import { Erc721TokenEventType, IErc721TokenHistory, TErc721TokenEventData } from "@framework/types";
import { ns } from "@framework/constants";
import { IdBaseEntity } from "@gemunion/nest-js-module-typeorm-helpers";

@Entity({ schema: ns, name: "erc721_token_history" })
export class Erc721TokenHistoryEntity extends IdBaseEntity implements IErc721TokenHistory {
  @Column({ type: "varchar" })
  public address: string;

  @Column({ type: "varchar" })
  public transactionHash: string;

  @Column({
    type: "enum",
    enum: Erc721TokenEventType,
  })
  public eventType: Erc721TokenEventType;

  @Column({ type: "json" })
  public eventData: TErc721TokenEventData;

  @Column({ type: "int", nullable: true })
  public erc721TokenId: number | null;
}
