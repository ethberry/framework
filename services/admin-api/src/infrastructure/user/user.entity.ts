import { Column, Entity, ManyToOne, OneToMany } from "typeorm";

import { IdDateBaseEntity } from "@ethberry/nest-js-module-typeorm-postgres";
import { EnabledCountries, EnabledGenders } from "@ethberry/constants";
import type { IUser } from "@framework/types";
import { UserRole, UserStatus } from "@framework/types";
import { EnabledLanguages, ns } from "@framework/constants";

import { MerchantEntity } from "../merchant/merchant.entity";
import { AddressEntity } from "../../ecommerce/address/address.entity";

@Entity({ schema: ns, name: "user" })
export class UserEntity extends IdDateBaseEntity implements IUser {
  @Column({ type: "varchar" })
  public sub: string;

  @Column({ type: "varchar" })
  public displayName: string;

  @Column({ type: "varchar" })
  public imageUrl: string;

  @Column({ type: "varchar" })
  public email: string;

  @Column({ type: "varchar" })
  public comment: string;

  @OneToMany(_type => AddressEntity, address => address.user, {
    cascade: ["remove", "insert"],
  })
  public addresses: Array<AddressEntity>;

  @Column({ type: "varchar" })
  public wallet: string;

  @Column({ type: "int" })
  public chainId: number;

  @Column({
    type: "enum",
    enum: EnabledLanguages,
  })
  public language: EnabledLanguages;

  @Column({
    type: "enum",
    enum: EnabledCountries,
    nullable: true,
  })
  public country: EnabledCountries | null;

  @Column({
    type: "enum",
    enum: EnabledGenders,
    nullable: true,
  })
  public gender: EnabledGenders | null;

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
