import { Column, Entity } from "typeorm";

import { ns } from "@framework/constants";
import { IStaking, StakingStatus } from "@framework/types";
import { SearchableEntity } from "@gemunion/nest-js-module-typeorm-helpers";

@Entity({ schema: ns, name: "staking" })
export class StakingEntity extends SearchableEntity implements IStaking {
  @Column({ type: "varchar" })
  public title: string;

  @Column({ type: "int" })
  public depositType: number;

  @Column({ type: "varchar" })
  public depositToken: string;

  @Column({ type: "varchar" })
  public depositTokenId: string;

  @Column({ type: "numeric" })
  public depositAmount: string;

  @Column({ type: "int" })
  public rewardType: number;

  @Column({ type: "varchar" })
  public rewardToken: string;

  @Column({ type: "varchar" })
  public rewardTokenId: string;

  @Column({ type: "numeric" })
  public rewardAmount: string;

  @Column({ type: "int" })
  public period: number;

  @Column({ type: "int" })
  public penalty: number;

  @Column({ type: "boolean" })
  public recurrent: number;

  @Column({
    type: "enum",
    enum: StakingStatus,
  })
  public stakingStatus: StakingStatus;
}
