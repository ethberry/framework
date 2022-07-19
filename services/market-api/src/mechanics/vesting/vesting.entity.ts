import { Column, Entity } from "typeorm";

import { DeployableEntity } from "@gemunion/nest-js-module-typeorm-helpers";
import { IVesting, VestingTemplate } from "@framework/types";
import { ns } from "@framework/constants";

@Entity({ schema: ns, name: "vesting" })
export class VestingEntity extends DeployableEntity implements IVesting {
  @Column({ type: "varchar" })
  public address: string;

  @Column({ type: "varchar" })
  public account: string;

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
