import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import { ns } from "@framework/constants";
import { IStakingStake, StakeStatus } from "@framework/types";
import { SearchableEntity } from "@gemunion/nest-js-module-typeorm-helpers";

import { StakingRulesEntity } from "../rules/rules.entity";

@Entity({ schema: ns, name: "staking_stakes" })
export class StakingStakesEntity extends SearchableEntity implements IStakingStake {
  @Column({ type: "varchar" })
  public account: string;

  @Column({ type: "numeric" })
  public externalId: string;

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
