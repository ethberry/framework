import { Column, Entity, ManyToOne } from "typeorm";
import { Exclude } from "class-transformer";

import { IUser, UserRole, UserStatus } from "@gemunion/framework-types";
import { EnabledLanguages, ns } from "@gemunion/framework-constants";
import { IdBaseEntity } from "@gemunion/nest-js-module-typeorm-helpers";

import { MerchantEntity } from "../merchant/merchant.entity";

@Entity({ schema: ns, name: "user" })
export class UserEntity extends IdBaseEntity implements IUser {
  @Column({ type: "varchar" })
  public email: string;

  @Exclude()
  @Column({ type: "varchar", select: false })
  public password: string;

  @Column({ type: "varchar" })
  public displayName: string;

  @Column({ type: "varchar" })
  public phoneNumber: string;

  @Column({ type: "varchar" })
  public imageUrl: string;

  @Column({ type: "varchar" })
  public comment: string;

  @Column({
    type: "enum",
    enum: EnabledLanguages,
  })
  public language: EnabledLanguages;

  @Column({
    type: "enum",
    enum: UserStatus,
  })
  public userStatus: UserStatus;

  @Column({
    type: "enum",
    enum: UserRole,
    array: true,
  })
  public userRoles: Array<UserRole>;

  @Column({ type: "int" })
  public merchantId: number;

  @ManyToOne(_type => MerchantEntity, merchantEntity => merchantEntity.users)
  public merchant: MerchantEntity;
}
