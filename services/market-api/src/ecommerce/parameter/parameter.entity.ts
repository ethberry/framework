import { Column, Entity, JoinTable, ManyToMany } from "typeorm";

import { ns } from "@framework/constants";
import type { IParameter } from "@framework/types";
import { ParameterType } from "@framework/types";
import { IdDateBaseEntity } from "@ethberry/nest-js-module-typeorm-postgres";

import { ProductItemEntity } from "../product-item/product-item.entity";

@Entity({ schema: ns, name: "parameter" })
export class ParameterEntity extends IdDateBaseEntity implements IParameter {
  @Column({ type: "varchar" })
  public parameterName: string;

  @Column({ type: "varchar" })
  public parameterType: ParameterType;

  @Column({ type: "varchar", nullable: true })
  public parameterValue: string | null;

  @Column({ type: "varchar", nullable: true })
  public parameterMinValue: string | null;

  @Column({ type: "varchar", nullable: true })
  public parameterMaxValue: string | null;

  @ManyToMany(_type => ProductItemEntity, productItem => productItem.parameters)
  @JoinTable({ name: "product_item_parameter" })
  public productItems: Array<ProductItemEntity>;
}
