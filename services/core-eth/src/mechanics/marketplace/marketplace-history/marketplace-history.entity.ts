import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import { ns } from "@framework/constants";

import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-helpers";

import { MarketplaceEventType, IMarketplaceHistory, TMarketplaceEventData } from "@framework/types";

import { TemplateEntity } from "../../../blockchain/hierarchy/template/template.entity";

@Entity({ schema: ns, name: "marketplace_history" })
export class MarketplaceHistoryEntity extends IdDateBaseEntity implements IMarketplaceHistory {
  @Column({ type: "varchar" })
  public address: string;

  @Column({ type: "varchar" })
  public transactionHash: string;

  @Column({
    type: "enum",
    enum: MarketplaceEventType,
  })
  public eventType: MarketplaceEventType;

  @Column({
    type: "json",
  })
  public eventData: TMarketplaceEventData;

  @Column({ type: "int", nullable: true })
  public tokenId: number | null;

  @JoinColumn()
  @ManyToOne(_type => TemplateEntity)
  public token?: TemplateEntity;
}
