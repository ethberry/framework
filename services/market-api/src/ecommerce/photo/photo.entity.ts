import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-postgres";
import { IPhoto, PhotoStatus } from "@framework/types";
import { ns } from "@framework/constants";

import { ProductEntity } from "../product/product.entity";

@Entity({ schema: ns, name: "photo" })
export class PhotoEntity extends IdDateBaseEntity implements IPhoto {
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
