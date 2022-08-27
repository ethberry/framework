import { Column, Entity, JoinColumn, OneToOne, ManyToOne } from "typeorm";

import { IdBaseEntity } from "@gemunion/nest-js-module-typeorm-postgres";
import { ExchangeType, IAssetComponentHistory, TokenType } from "@framework/types";
import { ns } from "@framework/constants";

import { ContractEntity } from "../../hierarchy/contract/contract.entity";
import { TokenEntity } from "../../hierarchy/token/token.entity";
import { ExchangeHistoryEntity } from "../exchange/history/exchange-history.entity";

@Entity({ schema: ns, name: "asset_component_history" })
export class AssetComponentHistoryEntity extends IdBaseEntity implements IAssetComponentHistory {
  @Column({
    type: "enum",
    enum: TokenType,
  })
  public tokenType: TokenType;

  @Column({
    type: "enum",
    enum: ExchangeType,
  })
  public exchangeType: ExchangeType;

  @Column({ type: "int" })
  public historyId: number;

  @JoinColumn()
  @ManyToOne(_type => ExchangeHistoryEntity)
  public history?: ExchangeHistoryEntity;

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
  public amount: string;
}
