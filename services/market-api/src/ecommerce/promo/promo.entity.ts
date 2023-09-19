import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-postgres";
import { IProductPromo } from "@framework/types";
import { ns } from "@framework/constants";

import { ProductEntity } from "../product/product.entity";

@Entity({ schema: ns, name: "product_promo" })
export class ProductPromoEntity extends IdDateBaseEntity implements IProductPromo {
  @Column({ type: "varchar" })
  public title: string;

  @JoinColumn()
  @OneToOne(_type => ProductEntity)
  public product: ProductEntity;

  @Column({ type: "int" })
  public productId: number;

  @Column({ type: "varchar" })
  public imageUrl: string;
}
