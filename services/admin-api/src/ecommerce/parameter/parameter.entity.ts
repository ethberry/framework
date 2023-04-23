import { BaseEntity, Column, Entity } from "typeorm";

import { IParameter } from "@framework/types";
import { ns } from "@framework/constants";

@Entity({ schema: ns, name: "parameter" })
export class ParameterEntity extends BaseEntity implements IParameter {
  @Column({ type: "varchar" })
  public parameterName: string;

  @Column({ type: "varchar" })
  public parameterType: string;

  @Column({ type: "varchar" })
  public parameterValue: string;

  @Column({ type: "varchar" })
  public parameterExtra: string;
}
