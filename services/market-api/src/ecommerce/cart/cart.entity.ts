import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";

import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-postgres";
import type { ICart } from "@framework/types";
import { ns } from "@framework/constants";

import { CartItemEntity } from "../cart-item/cart-item.entity";
import { UserEntity } from "../../infrastructure/user/user.entity";

@Entity({ schema: ns, name: "cart" })
export class CartEntity extends IdDateBaseEntity implements ICart {
  @JoinColumn()
  @OneToOne(_type => UserEntity)
  public user: UserEntity;

  @Column({ type: "int" })
  public userId: number;

  @OneToMany(_type => CartItemEntity, item => item.cart, {
    eager: true,
    cascade: ["remove", "insert"],
  })
  public items: Array<CartItemEntity>;
}
