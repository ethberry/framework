import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne } from "typeorm";

import { IProductItem } from "@framework/types";
import { ns } from "@framework/constants";
import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-postgres";

import { AssetEntity } from "../../blockchain/exchange/asset/asset.entity";
import { OrderItemEntity } from "../order-item/order-item.entity";
import { ProductEntity } from "../product/product.entity";
import { PhotoEntity } from "../photo/photo.entity";
import { ParameterEntity } from "../parameter/parameter.entity";
import { CustomParameterEntity } from "../custom-parameter/custom-parameter.entity";

@Entity({ schema: ns, name: "product_item" })
export class ProductItemEntity extends IdDateBaseEntity implements IProductItem {
  @JoinColumn()
  @OneToOne(_type => ProductEntity)
  public product: ProductEntity;

  @Column({ type: "int" })
  public productId: number;

  @JoinColumn()
  @OneToOne(_type => AssetEntity)
  public price: AssetEntity;

  @Column({ type: "int" })
  public priceId: number;

  @Column({ type: "int" })
  public maxQuantity: number;

  @Column({ type: "int" })
  public minQuantity: number;

  @Column({ type: "varchar" })
  public sku: string;

  @OneToMany(_type => PhotoEntity, photo => photo.productItem, {
    cascade: ["remove"],
  })
  public photo: PhotoEntity;

  @OneToMany(_type => OrderItemEntity, orderItem => orderItem.productItem)
  public orderItems: Array<OrderItemEntity>;

  @ManyToMany(_type => ParameterEntity || CustomParameterEntity, parameter => parameter.productItems)
  @JoinTable({ name: "product_item_parameter" })
  public parameters: Array<ParameterEntity | CustomParameterEntity>;
}
