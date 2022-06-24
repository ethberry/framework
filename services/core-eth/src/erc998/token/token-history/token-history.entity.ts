import { Column, Entity } from "typeorm";

import { Erc998TokenEventType, IErc998TokenHistory, TErc998TokenEventData } from "@framework/types";
import { ns } from "@framework/constants";
import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-helpers";

@Entity({ schema: ns, name: "erc998_token_history" })
export class Erc998TokenHistoryEntity extends IdDateBaseEntity implements IErc998TokenHistory {
  @Column({ type: "varchar" })
  public address: string;

  @Column({ type: "varchar" })
  public transactionHash: string;

  @Column({
    type: "enum",
    enum: Erc998TokenEventType,
  })
  public eventType: Erc998TokenEventType;

  @Column({ type: "json" })
  public eventData: TErc998TokenEventData;

  @Column({ type: "int", nullable: true })
  public erc998TokenId: number | null;
}
