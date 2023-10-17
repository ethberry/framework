import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import { ns } from "@framework/constants";
import type { IStakingDeposit } from "@framework/types";
import { StakingDepositStatus } from "@framework/types";
import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-postgres";

import { StakingRulesEntity } from "../rules/rules.entity";

@Entity({ schema: ns, name: "staking_deposit" })
export class StakingDepositEntity extends IdDateBaseEntity implements IStakingDeposit {
  @Column({ type: "varchar" })
  public account: string;

  @Column({ type: "numeric" })
  public externalId: string;

  @Column({
    type: "enum",
    enum: StakingDepositStatus,
  })
  public stakingDepositStatus: StakingDepositStatus;

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
