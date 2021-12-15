import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

import { IPromo } from "@gemunion/framework-types";
import { ns } from "@gemunion/framework-constants";

import { ProductEntity } from "../product/product.entity";
import { BaseEntity } from "../database/base.entity";

@Entity({ schema: ns, name: "promo" })
export class PromoEntity extends BaseEntity implements IPromo {
  @PrimaryGeneratedColumn()
  public id: number;

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
