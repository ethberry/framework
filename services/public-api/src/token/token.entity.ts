import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

import { IToken, TokenType } from "@gemunion/framework-types";
import { ns } from "@gemunion/framework-constants";
import { UuidBaseEntity } from "@gemunion/nest-js-module-typeorm-helpers";

import { UserEntity } from "../user/user.entity";

@Entity({ schema: ns, name: "token" })
export class TokenEntity extends UuidBaseEntity implements IToken {
  @Column({
    type: "enum",
    enum: TokenType,
  })
  public tokenType: TokenType;

  @JoinColumn()
  @OneToOne(_type => UserEntity)
  public user: UserEntity;

  @Column({ type: "int" })
  public userId: number;

  @Column({ type: "json" })
  public data: any;
}
