import {BaseEntity as OrmBaseEntity, BeforeInsert, BeforeUpdate, Column, PrimaryGeneratedColumn} from "typeorm";

import {IBase} from "@gemunionstudio/solo-types";

export abstract class BaseEntity extends OrmBaseEntity implements IBase {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({type: "timestamptz"})
  public createdAt: string;

  @Column({type: "timestamptz"})
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
