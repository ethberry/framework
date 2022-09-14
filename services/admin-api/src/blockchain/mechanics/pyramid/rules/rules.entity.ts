import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";

import { ns } from "@framework/constants";
import { IPyramidRule, PyramidStakingStatus } from "@framework/types";
import { SearchableEntity } from "@gemunion/nest-js-module-typeorm-postgres";

import { PyramidStakesEntity } from "../stakes/stakes.entity";
import { AssetEntity } from "../../asset/asset.entity";
import { ContractEntity } from "../../../hierarchy/contract/contract.entity";

@Entity({ schema: ns, name: "pyramid_rules" })
export class PyramidRulesEntity extends SearchableEntity implements IPyramidRule {
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
    enum: PyramidStakingStatus,
  })
  public stakingStatus: PyramidStakingStatus;

  @Column({ type: "numeric" })
  public externalId: string;

  @OneToMany(_type => PyramidStakesEntity, stake => stake.pyramidRule)
  public stakes: Array<PyramidStakesEntity>;
}
