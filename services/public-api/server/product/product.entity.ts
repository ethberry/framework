import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";

import {IProduct, ProductStatus} from "@trejgun/solo-types";
import {ns} from "@trejgun/solo-constants-misc";

import {MerchantEntity} from "../merchant/merchant.entity";
import {PhotoEntity} from "../photo/photo.entity";
import {BaseEntity} from "../common/base.entity";

@Entity({schema: ns, name: "product"})
export class ProductEntity extends BaseEntity implements IProduct {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({type: "varchar"})
  public title: string;

  @Column({type: "int"})
  public description: string;

  @Column({type: "int"})
  public price: number;

  @Column({type: "int"})
  public amount: number;

  @Column({
    type: "enum",
    enum: ProductStatus,
  })
  public productStatus: ProductStatus;

  @Column({type: "int"})
  public merchantId: number;

  @JoinColumn()
  @ManyToOne(_type => MerchantEntity, merchant => merchant.products)
  public merchant: MerchantEntity;

  @OneToMany(_type => PhotoEntity, photo => photo.product, {
    cascade: ["remove"],
  })
  public photos: Array<PhotoEntity>;
}
