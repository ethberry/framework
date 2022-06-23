import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import { ns } from "@framework/constants";
import { Erc998MarketplaceEventType, IErc998MarketplaceHistory, TErc998MarketplaceEventData } from "@framework/types";
import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-helpers";
import { Erc998TokenEntity } from "../../token/token.entity";

@Entity({ schema: ns, name: "erc998_marketplace_history" })
export class Erc998MarketplaceHistoryEntity extends IdDateBaseEntity implements IErc998MarketplaceHistory {
  @Column({ type: "varchar" })
  public address: string;

  @Column({ type: "varchar" })
  public transactionHash: string;

  @Column({
    type: "enum",
    enum: Erc998MarketplaceEventType,
  })
  public eventType: Erc998MarketplaceEventType;

  @Column({
    type: "json",
  })
  public eventData: TErc998MarketplaceEventData;

  @Column({ type: "int", nullable: true })
  public erc998TokenId: number | null;

  @JoinColumn()
  @ManyToOne(_type => Erc998TokenEntity)
  public erc998Token?: Erc998TokenEntity;
}
