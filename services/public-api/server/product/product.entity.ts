import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  ManyToMany,
  OneToMany,
  JoinTable,
  PrimaryGeneratedColumn,
} from "typeorm";

import { IProduct, ProductStatus } from "@gemunion/framework-types";
import { ns } from "@gemunion/framework-constants";

import { PhotoEntity } from "../photo/photo.entity";
import { BaseEntity } from "../database/base.entity";
import { MerchantEntity } from "../merchant/merchant.entity";
import { CategoryEntity } from "../category/category.entity";
import { OrderEntity } from "../order/order.entity";

@Entity({ schema: ns, name: "product" })
export class ProductEntity extends BaseEntity implements IProduct {
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

  @ManyToMany(_type => CategoryEntity, category => category.products)
  @JoinTable({ name: "product_to_category" })
  public categories: Array<CategoryEntity>;

  @OneToMany(_type => OrderEntity, order => order.product)
  public orders: Array<OrderEntity>;

  @Column({ type: "int" })
  public price: number;

  @Column({ type: "int" })
  public amount: number;

  @Column({
    type: "enum",
    enum: ProductStatus,
  })
  public productStatus: ProductStatus;

  @Column({ type: "int" })
  public merchantId: number;

  @JoinColumn()
  @ManyToOne(_type => MerchantEntity, merchant => merchant.products)
  public merchant: MerchantEntity;

  @OneToMany(_type => PhotoEntity, photo => photo.product, {
    cascade: ["remove"],
  })
  public photos: Array<PhotoEntity>;
}
