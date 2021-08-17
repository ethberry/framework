import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { IPhoto, PhotoStatus } from "@gemunion/framework-types";
import { ns } from "@gemunion/framework-constants-misc";

import { ProductEntity } from "../product/product.entity";
import { BaseEntity } from "../database/base.entity";

@Entity({ schema: ns, name: "photo" })
export class PhotoEntity extends BaseEntity implements IPhoto {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: "varchar" })
  public title: string;

  @Column({ type: "varchar" })
  public imageUrl: string;

  @JoinColumn()
  @ManyToOne(_type => ProductEntity, product => product.photos)
  public product: ProductEntity;

  @Column({ type: "int" })
  public productId: number;

  @Column({ type: "int" })
  public priority: number;

  @Column({
    type: "enum",
    enum: PhotoStatus,
  })
  public photoStatus: PhotoStatus;
}
