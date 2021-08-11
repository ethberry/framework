import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

import { ns } from "@gemunionstudio/framework-constants-misc";
import { IAuth } from "@gemunionstudio/framework-types";

import { UserEntity } from "../user/user.entity";
import { BaseEntity } from "../common/base.entity";

@Entity({ schema: ns, name: "auth" })
export class AuthEntity extends BaseEntity implements IAuth {
  @Column({ type: "varchar" })
  public refreshToken: string;

  @Column({ type: "bigint" })
  public refreshTokenExpiresAt: number;

  public accessToken: string;

  public accessTokenExpiresAt: number;

  @JoinColumn()
  @OneToOne(_type => UserEntity)
  public user: UserEntity;

  @Column({
    type: "varchar",
    select: false,
  })
  public ip: string;
}
