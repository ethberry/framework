import { Column, Entity, Generated, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { IToken, TokenType } from "@gemunionstudio/framework-types";
import { ns } from "@gemunionstudio/framework-constants-misc";

import { UserEntity } from "../user/user.entity";
import { BaseEntity } from "../common/base.entity";

@Entity({ schema: ns, name: "token" })
export class TokenEntity extends BaseEntity implements IToken {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: "uuid", unique: true })
  @Generated("uuid")
  public uuid: string;

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
}
