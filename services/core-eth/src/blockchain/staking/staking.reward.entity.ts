import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { Exclude } from "class-transformer";

import { ns } from "@framework/constants";
import { IStakingItem, TokenType } from "@framework/types";
import { IdBaseEntity } from "@gemunion/nest-js-module-typeorm-helpers";
import { StakingEntity } from "./staking.entity";

@Entity({ schema: ns, name: "staking_reward" })
export class StakingRewardEntity extends IdBaseEntity implements IStakingItem {
  @Column({
    type: "enum",
    enum: TokenType,
  })
  public tokenType: TokenType;

  @Column({ type: "int" })
  public collection: number;

  @Column({ type: "int" })
  public criteria: number;

  @Column({ type: "numeric" })
  public amount: string;

  @Exclude()
  @Column({ type: "int" })
  public stakingId: number;

  @JoinColumn()
  @OneToOne(_type => StakingEntity)
  public staking: StakingEntity;
}
