import { Column, Entity, OneToOne } from "typeorm";

import { ns } from "@framework/constants";
import { IStaking, StakingStatus } from "@framework/types";
import { SearchableEntity } from "@gemunion/nest-js-module-typeorm-helpers";

import { StakingDepositEntity } from "./staking.deposit.entity";
import { StakingRewardEntity } from "./staking.reward.entity";

@Entity({ schema: ns, name: "staking" })
export class StakingEntity extends SearchableEntity implements IStaking {
  @Column({ type: "varchar" })
  public title: string;

  @OneToOne(_type => StakingDepositEntity, deposit => deposit.staking, { cascade: true })
  public deposit: StakingDepositEntity;

  @OneToOne(_type => StakingRewardEntity, reward => reward.staking, { cascade: true })
  public reward: StakingRewardEntity;

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
}
