import { Column, Entity } from "typeorm";

import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-postgres";
import { IUser, UserRole, UserStatus } from "@framework/types";
import { EnabledLanguages, ns } from "@framework/constants";

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
    enum: UserStatus,
  })
  public userStatus: UserStatus;

  @Column({
    type: "enum",
    enum: UserRole,
    array: true,
  })
  public userRoles: Array<UserRole>;
}
