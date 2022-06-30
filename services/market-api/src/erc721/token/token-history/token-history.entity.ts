import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import {
  Erc721TokenEventType,
  IErc721TokenApprove,
  IErc721TokenApprovedForAll,
  IErc721TokenHistory,
  IErc721TokenTransfer,
} from "@framework/types";
import { ns } from "@framework/constants";
import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-helpers";

import { TokenEntity } from "../../../blockchain/hierarchy/token/token.entity";

@Entity({ schema: ns, name: "erc721_token_history" })
export class Erc721TokenHistoryEntity extends IdDateBaseEntity implements IErc721TokenHistory {
  @Column({ type: "varchar" })
  public address: string;

  @Column({ type: "varchar" })
  public transactionHash: string;

  @Column({
    type: "enum",
    enum: Erc721TokenEventType,
  })
  public eventType: Erc721TokenEventType;

  @Column({
    type: "json",
  })
  public eventData: IErc721TokenTransfer | IErc721TokenApprove | IErc721TokenApprovedForAll;

  @Column({ type: "int", nullable: true })
  public tokenId: number | null;

  @JoinColumn()
  @ManyToOne(_type => TokenEntity)
  public token?: TokenEntity;
}
