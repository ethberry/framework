import { Column, Entity, JoinColumn, OneToMany, ManyToOne, OneToOne } from "typeorm";

import { ns } from "@framework/constants";
import { DurationUnit, IStakingRule, StakingRuleStatus } from "@framework/types";
import { SearchableEntity } from "@gemunion/nest-js-module-typeorm-postgres";

import { StakingDepositEntity } from "../deposit/deposit.entity";
import { AssetEntity } from "../../../exchange/asset/asset.entity";
import { ContractEntity } from "../../../hierarchy/contract/contract.entity";

@Entity({ schema: ns, name: "staking_rules" })
export class StakingRulesEntity extends SearchableEntity implements IStakingRule {
  @Column({ type: "varchar" })
  public title: string;

  @Column({ type: "int" })
  public depositId: number;

  @JoinColumn()
  @OneToOne(_type => AssetEntity)
  public deposit: AssetEntity;

  @Column({ type: "int", nullable: true })
  public rewardId: number;

  @JoinColumn()
  @OneToOne(_type => AssetEntity)
  public reward: AssetEntity;

  @Column({ type: "int" })
  public durationAmount: number;

  @Column({
    type: "enum",
    enum: DurationUnit,
  })
  public durationUnit: DurationUnit;

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

  @Column({ type: "int" })
  public contractId: number;

  @JoinColumn()
  @ManyToOne(_type => ContractEntity)
  public contract: ContractEntity;

  @OneToMany(_type => StakingDepositEntity, stake => stake.stakingRule)
  public stakes: Array<StakingDepositEntity>;
}
