import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import {
  Erc998TokenEventType,
  IErc998TokenApprove,
  IErc998TokenApprovedForAll,
  IErc998TokenHistory,
  IErc998TokenTransfer,
} from "@framework/types";
import { ns } from "@framework/constants";
import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-helpers";

import { Erc998TokenEntity } from "../token.entity";

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

  @Column({
    type: "json",
  })
  public eventData: IErc998TokenTransfer | IErc998TokenApprove | IErc998TokenApprovedForAll;

  @Column({ type: "int", nullable: true })
  public erc998TokenId: number | null;

  @JoinColumn()
  @ManyToOne(_type => Erc998TokenEntity, token => token.history)
  public erc998Token?: Erc998TokenEntity;
}
