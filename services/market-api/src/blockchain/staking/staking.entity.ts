import { Column, Entity, OneToMany, OneToOne } from "typeorm";

import { ns } from "@framework/constants";
import { IStaking, StakingStatus } from "@framework/types";
import { BigNumberColumn, SearchableEntity } from "@gemunion/nest-js-module-typeorm-helpers";

import { StakesEntity } from "./stakes/stakes.entity";
import { AssetEntity } from "../asset/asset.entity";

@Entity({ schema: ns, name: "staking" })
export class StakingEntity extends SearchableEntity implements IStaking {
  @Column({ type: "varchar" })
  public title: string;

  @OneToOne(_type => AssetEntity)
  public deposit: AssetEntity;

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
    enum: StakingStatus,
  })
  public stakingStatus: StakingStatus;

  @BigNumberColumn()
  public ruleId: string;

  @OneToMany(_type => StakesEntity, stake => stake.stakingRule)
  public stakes: Array<StakesEntity>;
}
