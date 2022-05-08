import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import { ContractBaseEntity } from "@gemunion/nest-js-module-typeorm-helpers";
import { Erc20VestingType, IErc20Vesting } from "@framework/types";
import { ns } from "@framework/constants";

import { Erc20TokenEntity } from "../token/token.entity";

@Entity({ schema: ns, name: "erc20_vesting" })
export class Erc20VestingEntity extends ContractBaseEntity implements IErc20Vesting {
  @Column({ type: "varchar" })
  public token: string;

  @Column({ type: "varchar" })
  public amount: string;

  @Column({ type: "varchar" })
  public beneficiary: string;

  @Column({ type: "int" })
  public duration: number;

  @Column({ type: "timestamptz" })
  public startTimestamp: string;

  @Column({
    type: "enum",
    enum: Erc20VestingType,
  })
  public vestingType: Erc20VestingType;

  @Column({ type: "int" })
  public erc20TokenId: number;

  @JoinColumn()
  @ManyToOne(_type => Erc20TokenEntity)
  public erc20Token: Erc20TokenEntity;
}
