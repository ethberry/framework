import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

import { ns } from "@gemunion/framework-constants";
import { IAuth } from "@gemunion/framework-types";
import { GemunionBaseEntity } from "@gemunion/nest-js-module-typeorm";

import { UserEntity } from "../user/user.entity";

@Entity({ schema: ns, name: "auth" })
export class AuthEntity extends GemunionBaseEntity implements IAuth {
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
