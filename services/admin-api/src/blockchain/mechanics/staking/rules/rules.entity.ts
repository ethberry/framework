import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";

import { ns } from "@framework/constants";
import { IStakingRule, StakingRuleStatus } from "@framework/types";
import { SearchableEntity } from "@gemunion/nest-js-module-typeorm-postgres";

import { StakingDepositEntity } from "../deposit/deposit.entity";
import { AssetEntity } from "../../asset/asset.entity";

@Entity({ schema: ns, name: "staking_rules" })
export class StakingRulesEntity extends SearchableEntity implements IStakingRule {
  @Column({ type: "varchar" })
  public title: string;

  @Column({ type: "int" })
  public depositId: number;

  @JoinColumn()
  @OneToOne(_type => AssetEntity)
  public deposit: AssetEntity;

  @Column({ type: "int" })
  public rewardId: number;

  @JoinColumn()
  @OneToOne(_type => AssetEntity)
  public reward: AssetEntity;

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
  public stakingRuleStatus: StakingRuleStatus;

  @Column({ type: "numeric" })
  public externalId: string;

  @OneToMany(_type => StakingDepositEntity, stake => stake.stakingRule)
  public stakes: Array<StakingDepositEntity>;
}
