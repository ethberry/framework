import { Column, Entity, JoinColumn, OneToOne, ManyToOne } from "typeorm";

import { ns } from "@framework/constants";
import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-postgres";
import type { ILotteryRoundAggregation } from "@framework/types";

import { AssetEntity } from "../../../exchange/asset/asset.entity";
import { LotteryRoundEntity } from "./round.entity";

@Entity({ schema: ns, name: "lottery_round_aggregation" })
export class LotteryRoundAggregationEntity extends IdDateBaseEntity implements ILotteryRoundAggregation {
  @Column({ type: "int" })
  public roundId: number;

  @JoinColumn()
  @ManyToOne(_type => LotteryRoundEntity, round => round.aggregation)
  public round: LotteryRoundEntity;

  @Column({ type: "int" })
  public match: number;

  @Column({ type: "int" })
  public tickets: number;

  @JoinColumn()
  @OneToOne(_type => AssetEntity)
  public price: AssetEntity;

  @Column({ type: "int" })
  public priceId: number;
}
