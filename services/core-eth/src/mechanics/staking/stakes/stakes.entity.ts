import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import { ns } from "@framework/constants";
import { IStake, StakeStatus } from "@framework/types";
import { BigNumberColumn, SearchableEntity } from "@gemunion/nest-js-module-typeorm-helpers";

import { StakingRulesEntity } from "../staking-rules/staking-rules.entity";

@Entity({ schema: ns, name: "stakes" })
export class StakesEntity extends SearchableEntity implements IStake {
  @Column({ type: "varchar" })
  public owner: string;

  @BigNumberColumn()
  public stakeId: string;

  @Column({
    type: "enum",
    enum: StakeStatus,
  })
  public stakeStatus: StakeStatus;

  @Column({ type: "timestamptz" })
  public startTimestamp: string;

  @Column({ type: "timestamptz" })
  public withdrawTimestamp: string;

  @Column({ type: "int" })
  public multiplier: number;

  @Column({ type: "int" })
  public stakingRuleId: number;

  @JoinColumn()
  @ManyToOne(_type => StakingRulesEntity, rule => rule.stakes)
  public stakingRule: StakingRulesEntity;
}
