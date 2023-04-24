import { Column, Entity } from "typeorm";

import { ns } from "@framework/constants";
import { IParameter, ParameterType } from "@framework/types";
import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-postgres";

@Entity({ schema: ns, name: "parameter" })
export class ParameterEntity extends IdDateBaseEntity implements IParameter {
  @Column({ type: "varchar" })
  public parameterName: string;

  @Column({ type: "varchar" })
  public parameterType: ParameterType;

  @Column({ type: "varchar" })
  public parameterValue: string;

  @Column({ type: "varchar" })
  public parameterMinValue: string;

  @Column({ type: "varchar" })
  public parameterMaxValue: string;
}
