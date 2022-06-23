import { Column, Entity, OneToOne, OneToMany } from "typeorm";

import { ns } from "@framework/constants";
import { IStakingRule, StakingRuleStatus } from "@framework/types";
import { SearchableEntity, BigNumberColumn } from "@gemunion/nest-js-module-typeorm-helpers";

import { StakingDepositEntity } from "./staking.deposit.entity";
import { StakingRewardEntity } from "./staking.reward.entity";
import { StakesEntity } from "./stakes/stakes.entity";

@Entity({ schema: ns, name: "staking_rule" })
export class StakingRuleEntity extends SearchableEntity implements IStakingRule {
  @Column({ type: "varchar" })
  public title: string;

  @OneToOne(_type => StakingDepositEntity, deposit => deposit.stakingRule, { cascade: true })
  public deposit: StakingDepositEntity;

  @OneToOne(_type => StakingRewardEntity, reward => reward.stakingRule, { cascade: true })
  public reward: StakingRewardEntity;

  @Column({ type: "int" })
  public duration: number;

  @Column({ type: "int" })
  public penalty: number;

  @Column({ type: "boolean" })
  public recurrent: boolean;

  @Column({
    type: "enum",
    enum: StakingRuleStatus,
  })
  public stakingStatus: StakingRuleStatus;

  @BigNumberColumn()
  public ruleId: string;

  @OneToMany(_type => StakesEntity, stake => stake.stakingRule)
  public stakes: Array<StakesEntity>;
}
