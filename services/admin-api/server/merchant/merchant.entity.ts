import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";

import {IMerchant, MerchantStatus} from "@gemunionstudio/framework-types";
import {ns} from "@gemunionstudio/framework-constants-misc";

import {UserEntity} from "../user/user.entity";
import {ProductEntity} from "../product/product.entity";
import {BaseEntity} from "../common/base.entity";
import {OrderEntity} from "../order/order.entity";

@Entity({schema: ns, name: "merchant"})
export class MerchantEntity extends BaseEntity implements IMerchant {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({type: "varchar"})
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

  @Column({type: "varchar"})
  public email: string;

  @Column({type: "varchar"})
  public phoneNumber: string;

  @Column({type: "varchar"})
  public imageUrl: string;

  @Column({
    type: "enum",
    enum: MerchantStatus,
  })
  public merchantStatus: MerchantStatus;

  @OneToMany(_type => UserEntity, user => user.merchant)
  public users: Array<UserEntity>;

  @OneToMany(_type => ProductEntity, product => product.merchant, {
    cascade: ["remove"],
  })
  public products: Array<ProductEntity>;

  @OneToMany(_type => OrderEntity, order => order.merchant, {
    cascade: ["remove"],
  })
  public orders: Array<OrderEntity>;
}
