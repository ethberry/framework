import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";

import { DeployableEntity } from "@gemunion/nest-js-module-typeorm-postgres";
import type { IEventHistory, TContractEventData } from "@framework/types";
import { ContractEventType } from "@framework/types";
import { ns } from "@framework/constants";

import { AssetComponentHistoryEntity } from "../exchange/asset/asset-component-history.entity";
import { TokenEntity } from "../hierarchy/token/token.entity";
import { ContractEntity } from "../hierarchy/contract/contract.entity";

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

  @JoinColumn()
  @ManyToOne(_type => TokenEntity, token => token.history)
  public token: TokenEntity;

  @Column({ type: "int", nullable: true })
  public contractId: number | null;

  @JoinColumn()
  @ManyToOne(_type => ContractEntity, contract => contract.history)
  public contract: ContractEntity;

  @OneToMany(_type => AssetComponentHistoryEntity, assets => assets.history)
  public assets: Array<AssetComponentHistoryEntity>;
}
