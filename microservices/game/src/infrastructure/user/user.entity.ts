import { Column, Entity, ManyToOne } from "typeorm";

import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-postgres";
import { EnabledCountries, EnabledGenders } from "@gemunion/constants";
import type { IUser } from "@framework/types";
import { UserRole, UserStatus } from "@framework/types";
import { EnabledLanguages, ns } from "@framework/constants";
import { MerchantEntity } from "../merchant/merchant.entity";

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

  @Column({ type: "varchar" })
  public wallet: string;

  @Column({ type: "varchar" })
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
