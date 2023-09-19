import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";

import { ns } from "@framework/constants";
import { DurationUnit, IPonziRule, PonziRuleStatus } from "@framework/types";
import { SearchableEntity } from "@gemunion/nest-js-module-typeorm-postgres";

import { PonziDepositEntity } from "../deposit/deposit.entity";
import { AssetEntity } from "../../../exchange/asset/asset.entity";
import { ContractEntity } from "../../../hierarchy/contract/contract.entity";

@Entity({ schema: ns, name: "ponzi_rules" })
export class PonziRulesEntity extends SearchableEntity implements IPonziRule {
  @Column({ type: "varchar" })
  public title: string;

  @Column({ type: "int" })
  public contractId: number;

  @JoinColumn()
  @OneToOne(_type => ContractEntity)
  public contract: ContractEntity;

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

  @Column({ type: "int" })
  public maxCycles: number;

  @Column({
    type: "enum",
    enum: PonziRuleStatus,
  })
  public ponziRuleStatus: PonziRuleStatus;

  @Column({ type: "numeric" })
  public externalId: string;

  @OneToMany(_type => PonziDepositEntity, ponzi => ponzi.ponziRule)
  public stakes: Array<PonziDepositEntity>;
}
