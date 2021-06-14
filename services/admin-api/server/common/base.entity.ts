import {BaseEntity as OrmBaseEntity, BeforeInsert, BeforeUpdate, Column, PrimaryGeneratedColumn} from "typeorm";

import {IBase} from "@trejgun/solo-types";

export abstract class BaseEntity extends OrmBaseEntity implements IBase {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({type: "timestamptz"})
  public createdAt: Date;

  @Column({type: "timestamptz"})
  public updatedAt: Date;

  @BeforeInsert()
  public beforeInsert(): void {
    const date = new Date();
    this.createdAt = date;
    this.updatedAt = date;
  }

  @BeforeUpdate()
  public beforeUpdate(): void {
    const date = new Date();
    this.updatedAt = date;
  }
}
