import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";

import { IdBaseEntity } from "@ethberry/nest-js-module-typeorm-postgres";
import { ExchangeType, IAssetComponentHistory } from "@framework/types";
import { ns } from "@framework/constants";

import { TokenEntity } from "../../hierarchy/token/token.entity";
import { ContractEntity } from "../../hierarchy/contract/contract.entity";
import { EventHistoryEntity } from "../../event-history/event-history.entity";

@Entity({ schema: ns, name: "asset_component_history" })
export class AssetComponentHistoryEntity extends IdBaseEntity implements IAssetComponentHistory {
  @Column({
    type: "enum",
    enum: ExchangeType,
  })
  public exchangeType: ExchangeType;

  @Column({ type: "int" })
  public historyId: number;

  @JoinColumn()
  @ManyToOne(_type => EventHistoryEntity)
  public history?: EventHistoryEntity;

  @Column({ type: "int" })
  public contractId: number;

  @JoinColumn()
  @OneToOne(_type => ContractEntity)
  public contract: ContractEntity;

  @Column({ type: "int", nullable: true })
  public tokenId: number | null;

  @JoinColumn()
  @OneToOne(_type => TokenEntity)
  public token: TokenEntity;

  @Column({ type: "numeric" })
  public amount: bigint;
}
