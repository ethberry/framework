import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-postgres";
import type { IStock } from "@framework/types";
import { ns } from "@framework/constants";

import { ProductItemEntity } from "../product-item/product-item.entity";

@Entity({ schema: ns, name: "stock" })
export class StockEntity extends IdDateBaseEntity implements IStock {
  @JoinColumn()
  @OneToOne(_type => ProductItemEntity)
  public productItem: ProductItemEntity;

  @Column({ type: "int" })
  public productItemId: number;

  @Column({ type: "int" })
  public totalStockQuantity: number;

  @Column({ type: "int" })
  public reservedStockQuantity: number;
}
