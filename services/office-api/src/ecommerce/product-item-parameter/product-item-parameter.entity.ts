import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-postgres";
import { IProductItemParameter } from "@framework/types";
import { ns } from "@framework/constants";

import { ProductItemEntity } from "../product-item/product-item.entity";

@Entity({ schema: ns, name: "product_item_parameter" })
export class ProductItemParameterEntity extends IdDateBaseEntity implements IProductItemParameter {
  @JoinColumn()
  @OneToOne(_type => ProductItemEntity)
  public productItem: ProductItemEntity;

  @Column({ type: "int" })
  public productItemId: number;

  @Column({ type: "int", nullable: true })
  public customParameterId: number | null;

  @Column({ type: "int", nullable: true })
  public parameterId: number | null;

  @Column({ type: "varchar" })
  public userCustomValue: string;
}
