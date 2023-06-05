import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";

import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-postgres";
import { IPhoto, PhotoStatus } from "@framework/types";
import { ns } from "@framework/constants";

import { ProductEntity } from "../product/product.entity";
import { ProductItemEntity } from "../product-item/product-item.entity";

@Entity({ schema: ns, name: "photo" })
export class PhotoEntity extends IdDateBaseEntity implements IPhoto {
  @Column({ type: "varchar" })
  public title: string;

  @Column({ type: "varchar" })
  public imageUrl: string;

  @JoinColumn()
  @ManyToOne(_type => ProductEntity, product => product.photos)
  public product: ProductEntity | null;

  @Column({ type: "int" })
  public productId: number;

  @JoinColumn()
  @OneToOne(_type => ProductItemEntity, productItem => productItem.photo)
  public productItem: ProductItemEntity | null;

  @Column({ type: "int" })
  public productItemId: number;

  @Column({ type: "int" })
  public priority: number;

  @Column({
    type: "enum",
    enum: PhotoStatus,
  })
  public photoStatus: PhotoStatus;
}
