import { Column, Entity, OneToMany } from "typeorm";

import type { IMerchant } from "@framework/types";
import { MerchantStatus } from "@framework/types";
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

  @Column({ type: "varchar" })
  public apiKey: string;

  @Column({
    type: "enum",
    enum: MerchantStatus,
  })
  public merchantStatus: MerchantStatus;

  @OneToMany(_type => UserEntity, user => user.merchant)
  public users: Array<UserEntity>;

  public products: Array<any>;

  public orders: Array<any>;
}
