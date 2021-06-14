import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Exclude} from "class-transformer";

import {IUser, UserRole, UserStatus} from "@trejgun/solo-types";
import {EnabledLanguages, ns} from "@trejgun/solo-constants-misc";

import {MerchantEntity} from "../merchant/merchant.entity";
import {BaseEntity} from "../common/base.entity";

@Entity({schema: ns, name: "user"})
export class UserEntity extends BaseEntity implements IUser {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({type: "varchar"})
  public email: string;

  @Exclude()
  @Column({type: "varchar", select: false})
  public password: string;

  @Column({type: "varchar"})
  public firstName: string;

  @Column({type: "varchar"})
  public lastName: string;

  @Column({type: "varchar"})
  public phoneNumber: string;

  @Column({type: "varchar"})
  public imageUrl: string;

  @Column({type: "varchar"})
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

  @Column({type: "int"})
  public merchantId: number;

  @ManyToOne(_type => MerchantEntity, merchant => merchant.users)
  public merchant: MerchantEntity;
}
