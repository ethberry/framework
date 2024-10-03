import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";

import { DeployableEntity } from "@ethberry/nest-js-module-typeorm-postgres";
import type { IEventHistory, TContractEventData, TContractEventType } from "@framework/types";
import { ns } from "@framework/constants";

import { AssetComponentHistoryEntity } from "../exchange/asset/asset-component-history.entity";
import { TokenEntity } from "../hierarchy/token/token.entity";

@Entity({ schema: ns, name: "event_history" })
export class EventHistoryEntity extends DeployableEntity implements IEventHistory {
  @Column({ type: "varchar" })
  public transactionHash: string;

  @Column({ type: "varchar" })
  public eventType: TContractEventType;

  @Column({ type: "json" })
  public eventData: TContractEventData;

  @Column({ type: "int", nullable: true })
  public tokenId: number | null;

  @JoinColumn()
  @ManyToOne(_type => TokenEntity, token => token.history)
  public token: TokenEntity;

  @Column({ type: "int", nullable: true })
  public contractId: number;

  @Column({ type: "int", nullable: true })
  public parentId: number | null;

  @JoinColumn()
  @OneToOne(_type => EventHistoryEntity)
  public parent: EventHistoryEntity;

  @OneToMany(_type => AssetComponentHistoryEntity, assets => assets.history)
  public assets: Array<AssetComponentHistoryEntity>;
}
