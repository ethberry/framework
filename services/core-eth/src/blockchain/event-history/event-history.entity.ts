import { Column, Entity, OneToMany } from "typeorm";

import type { IEventHistory, TContractEventData } from "@framework/types";
import { ContractEventType } from "@framework/types";
import { ns } from "@framework/constants";
import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-postgres";
import { AssetComponentHistoryEntity } from "../exchange/asset/asset-component-history.entity";

@Entity({ schema: ns, name: "event_history" })
export class EventHistoryEntity extends IdDateBaseEntity implements IEventHistory {
  @Column({ type: "varchar" })
  public address: string;

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

  @OneToMany(_type => AssetComponentHistoryEntity, assets => assets.history)
  public assets: Array<AssetComponentHistoryEntity>;
}
