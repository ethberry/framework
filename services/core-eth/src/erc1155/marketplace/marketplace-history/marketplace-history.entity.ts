import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import { ns } from "@framework/constants";
import {
  Erc1155MarketplaceEventType,
  IErc1155MarketplaceHistory,
  IErc1155MarketplaceRedeemSingle,
  TErc1155MarketplaceEventData,
} from "@framework/types";
import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-helpers";

import { UniTemplateEntity } from "../../../blockchain/uni-token/uni-template/uni-template.entity";

@Entity({ schema: ns, name: "erc1155_marketplace_history" })
export class Erc1155MarketplaceHistoryEntity extends IdDateBaseEntity implements IErc1155MarketplaceHistory {
  @Column({ type: "varchar" })
  public address: string;

  @Column({ type: "varchar" })
  public transactionHash: string;

  @Column({
    type: "enum",
    enum: Erc1155MarketplaceEventType,
  })
  public eventType: Erc1155MarketplaceEventType;

  @Column({
    type: "json",
  })
  public eventData: TErc1155MarketplaceEventData | IErc1155MarketplaceRedeemSingle;

  @Column({ type: "int", nullable: true })
  public uniTokenId: number | null;

  @JoinColumn()
  @ManyToOne(_type => UniTemplateEntity)
  public uniToken?: UniTemplateEntity;
}
