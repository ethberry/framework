import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import { ns } from "@framework/constants";
import { Erc721MarketplaceEventType, IErc721MarketplaceHistory, TErc721MarketplaceEventData } from "@framework/types";
import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-helpers";

import { UniTokenEntity } from "../../../blockchain/uni-token/uni-token/uni-token.entity";

@Entity({ schema: ns, name: "erc721_marketplace_history" })
export class Erc721MarketplaceHistoryEntity extends IdDateBaseEntity implements IErc721MarketplaceHistory {
  @Column({ type: "varchar" })
  public address: string;

  @Column({ type: "varchar" })
  public transactionHash: string;

  @Column({
    type: "enum",
    enum: Erc721MarketplaceEventType,
  })
  public eventType: Erc721MarketplaceEventType;

  @Column({
    type: "json",
  })
  public eventData: TErc721MarketplaceEventData;

  @Column({ type: "int", nullable: true })
  public uniTokenId: number | null;

  @JoinColumn()
  @ManyToOne(_type => UniTokenEntity)
  public uniToken?: UniTokenEntity;
}
