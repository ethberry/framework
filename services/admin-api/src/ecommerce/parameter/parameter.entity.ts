import { Column, Entity, JoinTable, ManyToMany } from "typeorm";

import { ns } from "@framework/constants";
import { IParameter, ParameterType } from "@framework/types";
import { IdBaseEntity } from "@gemunion/nest-js-module-typeorm-postgres";

import { ProductEntity } from "../product/product.entity";

@Entity({ schema: ns, name: "parameter" })
export class ParameterEntity extends IdBaseEntity implements IParameter {
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

  @ManyToMany(_type => ProductEntity, product => product.parameters)
  @JoinTable({ name: "product_to_parameter" })
  public products: Array<ProductEntity>;
}
