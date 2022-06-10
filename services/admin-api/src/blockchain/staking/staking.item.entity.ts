import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { Exclude } from "class-transformer";

import { ns } from "@framework/constants";
import { IStakingItem, ItemType } from "@framework/types";
import { IdBaseEntity } from "@gemunion/nest-js-module-typeorm-helpers";
import { StakingEntity } from "./staking.entity";

@Entity({ schema: ns, name: "staking_item" })
export class StakingItemEntity extends IdBaseEntity implements IStakingItem {
  @Column({ type: "int" })
  public itemType: ItemType;

  @Column({ type: "varchar" })
  public token: string;

  @Column({ type: "varchar" })
  public criteria: string;

  @Column({ type: "numeric" })
  public amount: string;

  @Exclude()
  @Column({ type: "int" })
  public stakingId: number;

  @JoinColumn()
  @OneToOne(_type => StakingEntity)
  public staking: StakingEntity;
}
