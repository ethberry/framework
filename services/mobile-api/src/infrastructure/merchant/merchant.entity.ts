import { Column, Entity, OneToMany } from "typeorm";

import type { IMerchant, IMerchantSocial } from "@framework/types";
import { MerchantStatus, RatePlanType } from "@framework/types";
import { ns } from "@framework/constants";
import { SearchableEntity } from "@gemunion/nest-js-module-typeorm-postgres";

import { UserEntity } from "../user/user.entity";

@Entity({ schema: ns, name: "merchant" })
export class MerchantEntity extends SearchableEntity implements IMerchant {
  @Column({ type: "varchar" })
  public email: string;

  @Column({ type: "varchar" })
  public phoneNumber: string;

  @Column({ type: "varchar" })
  public imageUrl: string;

  @Column({
    type: "varchar",
    select: false,
  })
  public apiKey: string;

  @Column({
    type: "enum",
    enum: MerchantStatus,
  })
  public merchantStatus: MerchantStatus;

  @Column({ type: "json" })
  public social: IMerchantSocial;

  @Column({
    type: "enum",
    enum: RatePlanType,
  })
  public ratePlan: RatePlanType;

  @OneToMany(_type => UserEntity, user => user.merchant)
  public users: Array<UserEntity>;

  public products: Array<any>;

  public orders: Array<any>;
}
