import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import {
  Erc998TokenEventType,
  ITokenApprove,
  ITokenApprovedForAll,
  ITokenHistory,
  ITokenTransfer,
} from "@framework/types";
import { ns } from "@framework/constants";
import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-helpers";
import { TokenEntity } from "../../../blockchain/hierarchy/token/token.entity";

@Entity({ schema: ns, name: "erc998_token_history" })
export class Erc998TokenHistoryEntity extends IdDateBaseEntity implements ITokenHistory {
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
  public eventData: ITokenTransfer | ITokenApprove | ITokenApprovedForAll;

  @Column({ type: "int", nullable: true })
  public tokenId: number | null;

  @JoinColumn()
  @ManyToOne(_type => TokenEntity)
  public token?: TokenEntity;
}
