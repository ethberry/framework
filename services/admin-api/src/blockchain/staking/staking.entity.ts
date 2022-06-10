import { Column, Entity, OneToOne } from "typeorm";

import { ns } from "@framework/constants";
import { IStaking, StakingStatus } from "@framework/types";
import { SearchableEntity } from "@gemunion/nest-js-module-typeorm-helpers";

import { StakingItemEntity } from "./staking.item.entity";

@Entity({ schema: ns, name: "staking" })
export class StakingEntity extends SearchableEntity implements IStaking {
  @Column({ type: "varchar" })
  public title: string;

  @OneToOne(_type => StakingItemEntity, deposit => deposit.staking, { cascade: true })
  public deposit: StakingItemEntity;

  @OneToOne(_type => StakingItemEntity, reward => reward.staking, { cascade: true })
  public reward: StakingItemEntity;

  @Column({ type: "int" })
  public period: number;

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
