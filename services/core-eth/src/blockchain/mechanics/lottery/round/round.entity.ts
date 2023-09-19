import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";

import { ns } from "@framework/constants";
import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-postgres";
import type { ILotteryRound } from "@framework/types";

import { AssetEntity } from "../../../exchange/asset/asset.entity";
import { ContractEntity } from "../../../hierarchy/contract/contract.entity";
import { LotteryRoundAggregationEntity } from "./round.aggregation.entity";

@Entity({ schema: ns, name: "lottery_round" })
export class LotteryRoundEntity extends IdDateBaseEntity implements ILotteryRound {
  @Column({ type: "boolean", array: true })
  public numbers: Array<boolean>;

  @Column({ type: "numeric" })
  public roundId: string;

  @Column({ type: "numeric" })
  public contractId: number;

  @JoinColumn()
  @ManyToOne(_type => ContractEntity)
  public contract: ContractEntity;

  @JoinColumn()
  @ManyToOne(_type => ContractEntity)
  public ticketContract: ContractEntity;

  @Column({ type: "numeric" })
  public ticketContractId: number;

  @JoinColumn()
  @OneToOne(_type => AssetEntity)
  public price: AssetEntity;

  @Column({ type: "int" })
  public priceId: number;

  @Column({ type: "numeric" })
  public maxTickets: number;

  @Column({ type: "timestamptz" })
  public startTimestamp: string;

  @Column({ type: "timestamptz" })
  public endTimestamp: string;

  @OneToMany(_type => LotteryRoundAggregationEntity, aggregation => aggregation.round)
  public aggregation?: Array<LotteryRoundAggregationEntity>;
}
