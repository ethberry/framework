import { Column, Entity, OneToMany, JoinColumn, OneToOne } from "typeorm";

import { DeployableEntity } from "@gemunion/nest-js-module-typeorm-postgres";
import type { IEventHistory, TContractEventData } from "@framework/types";
import { ContractEventType } from "@framework/types";
import { ns } from "@framework/constants";

import { AssetComponentHistoryEntity } from "../exchange/asset/asset-component-history.entity";

@Entity({ schema: ns, name: "event_history" })
export class EventHistoryEntity extends DeployableEntity implements IEventHistory {
  @Column({ type: "varchar" })
  public transactionHash: string;

  @Column({
    type: "enum",
    enum: ContractEventType,
  })
  public eventType: ContractEventType;

  @Column({ type: "json" })
  public eventData: TContractEventData;

  @Column({ type: "int", nullable: true })
  public tokenId: number | null;

  @Column({ type: "int", nullable: true })
  public contractId: number | null;

  @Column({ type: "int", nullable: true })
  public parentId: number | null;

  @JoinColumn()
  @OneToOne(_type => EventHistoryEntity)
  public parent: EventHistoryEntity;

  @OneToMany(_type => AssetComponentHistoryEntity, assets => assets.history)
  public assets: Array<AssetComponentHistoryEntity>;
}
