import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
} from "typeorm";
import { IToken, TokenType } from "@gemunion/framework-types";
import { ns } from "@gemunion/framework-constants-misc";

import { UserEntity } from "../user/user.entity";

@Entity({ schema: ns, name: "token" })
export class TokenEntity extends BaseEntity implements IToken {
  @Column({ type: "uuid", unique: true })
  @PrimaryGeneratedColumn("uuid")
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

  @Column({ type: "timestamptz" })
  public createdAt: string;

  @Column({ type: "timestamptz" })
  public updatedAt: string;

  @BeforeInsert()
  public beforeInsert(): void {
    const date = new Date();
    this.createdAt = date.toISOString();
    this.updatedAt = date.toISOString();
  }

  @BeforeUpdate()
  public beforeUpdate(): void {
    const date = new Date();
    this.updatedAt = date.toISOString();
  }
}
