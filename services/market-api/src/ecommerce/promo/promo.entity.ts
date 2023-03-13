import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-postgres";
import { IPromo } from "@framework/types";
import { ns } from "@framework/constants";

import { ProductEntity } from "../product/product.entity";

@Entity({ schema: ns, name: "promo" })
export class PromoEntity extends IdDateBaseEntity implements IPromo {
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
