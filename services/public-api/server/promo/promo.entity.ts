import {Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm";

import {IPromo} from "@trejgun/solo-types";
import {ns} from "@trejgun/solo-constants-misc";

import {ProductEntity} from "../product/product.entity";
import {BaseEntity} from "../common/base.entity";

@Entity({schema: ns, name: "promo"})
export class PromoEntity extends BaseEntity implements IPromo {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({type: "varchar"})
  public title: string;

  @JoinColumn()
  @OneToOne(_type => ProductEntity)
  public product: ProductEntity;

  @Column({type: "int"})
  public productId: number;

  @Column({type: "varchar"})
  public imageUrl: string;
}
