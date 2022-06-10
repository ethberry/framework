import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { Exclude } from "class-transformer";

import { ns } from "@framework/constants";
import { IStakingItem, TokenType } from "@framework/types";
import { IdBaseEntity } from "@gemunion/nest-js-module-typeorm-helpers";
import { StakingEntity } from "./staking.entity";

@Entity({ schema: ns, name: "staking_deposit" })
export class StakingDepositEntity extends IdBaseEntity implements IStakingItem {
  @Column({ type: "int" })
  public tokenType: TokenType;

  @Column({ type: "int" })
  public token: number;

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
