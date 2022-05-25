import { Column, Entity } from "typeorm";

import { ContractBaseEntity } from "@gemunion/nest-js-module-typeorm-helpers";
import { Erc20VestingTemplate, IErc20Vesting } from "@framework/types";
import { ns } from "@framework/constants";

@Entity({ schema: ns, name: "erc20_vesting" })
export class Erc20VestingEntity extends ContractBaseEntity implements IErc20Vesting {
  @Column({ type: "varchar" })
  public address: string;

  @Column({ type: "varchar" })
  public beneficiary: string;

  @Column({ type: "int" })
  public duration: number;

  @Column({ type: "timestamptz" })
  public startTimestamp: string;

  @Column({
    type: "enum",
    enum: Erc20VestingTemplate,
  })
  public contractTemplate: Erc20VestingTemplate;
}
