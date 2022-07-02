import { Column, Entity } from "typeorm";

import { ContractBaseEntity as DeployableEntity } from "@gemunion/nest-js-module-typeorm-helpers";
import { VestingTemplate, IVesting } from "@framework/types";
import { ns } from "@framework/constants";

@Entity({ schema: ns, name: "vesting" })
export class VestingEntity extends DeployableEntity implements IVesting {
  @Column({ type: "varchar" })
  public beneficiary: string;

  @Column({ type: "int" })
  public duration: number;

  @Column({ type: "timestamptz" })
  public startTimestamp: string;

  @Column({
    type: "enum",
    enum: VestingTemplate,
  })
  public contractTemplate: VestingTemplate;
}
