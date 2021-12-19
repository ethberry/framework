import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

import { IPromo } from "@gemunion/framework-types";
import { ns } from "@gemunion/framework-constants";
import { GemunionBaseEntity } from "@gemunion/nest-js-module-typeorm-debug";

import { ProductEntity } from "../product/product.entity";

@Entity({ schema: ns, name: "promo" })
export class PromoEntity extends GemunionBaseEntity implements IPromo {
  @Column({ type: "varchar" })
  public title: string;

  @Column({
    type: "json",
    transformer: {
      from(val: Record<string, any>) {
        return JSON.stringify(val);
      },
      to(val: string) {
        return JSON.parse(val) as Record<string, any>;
      },
    },
  })
  public description: string;

  @JoinColumn()
  @OneToOne(_type => ProductEntity)
  public product: ProductEntity;

  @Column({ type: "int" })
  public productId: number;

  @Column({ type: "varchar" })
  public imageUrl: string;
}
