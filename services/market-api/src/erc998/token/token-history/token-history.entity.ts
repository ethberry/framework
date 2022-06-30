import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import {
  Erc998TokenEventType,
  IUniTokenApprove,
  IUniTokenApprovedForAll,
  IUniTokenHistory,
  IUniTokenTransfer,
} from "@framework/types";
import { ns } from "@framework/constants";
import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-helpers";
import { UniTokenEntity } from "../../../blockchain/uni-token/uni-token/uni-token.entity";

@Entity({ schema: ns, name: "erc998_token_history" })
export class Erc998TokenHistoryEntity extends IdDateBaseEntity implements IUniTokenHistory {
  @Column({ type: "varchar" })
  public address: string;

  @Column({ type: "varchar" })
  public transactionHash: string;

  @Column({
    type: "enum",
    enum: Erc998TokenEventType,
  })
  public eventType: Erc998TokenEventType;

  @Column({
    type: "json",
  })
  public eventData: IUniTokenTransfer | IUniTokenApprove | IUniTokenApprovedForAll;

  @Column({ type: "int", nullable: true })
  public uniTokenId: number | null;

  @JoinColumn()
  @ManyToOne(_type => UniTokenEntity)
  public uniToken?: UniTokenEntity;
}
