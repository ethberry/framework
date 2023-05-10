import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne } from "typeorm";

import { IProduct, ProductStatus } from "@framework/types";
import { ns } from "@framework/constants";
import { SearchableEntity } from "@gemunion/nest-js-module-typeorm-postgres";

import { CategoryEntity } from "../category/category.entity";
import { MerchantEntity } from "../../infrastructure/merchant/merchant.entity";
import { PhotoEntity } from "../photo/photo.entity";
import { AssetEntity } from "../../blockchain/exchange/asset/asset.entity";
import { ProductItemEntity } from "../product-item/product-item.entity";

@Entity({ schema: ns, name: "product" })
export class ProductEntity extends SearchableEntity implements IProduct {
  @ManyToMany(_type => CategoryEntity, category => category.products)
  @JoinTable({ name: "product_to_category" })
  public categories: Array<CategoryEntity>;

  @JoinColumn()
  @OneToOne(_type => AssetEntity)
  public price: AssetEntity;

  @Column({ type: "int" })
  public priceId: number;

  @Column({ type: "int" })
  public amount: number;

  @Column({
    type: "enum",
    enum: ProductStatus,
  })
  public productStatus: ProductStatus;

  @Column({ type: "int" })
  public merchantId: number;

  @JoinColumn()
  @ManyToOne(_type => MerchantEntity, merchant => merchant.products)
  public merchant: MerchantEntity;

  @OneToMany(_type => PhotoEntity, photo => photo.product, {
    cascade: ["remove"],
  })
  public photos: Array<PhotoEntity>;

  @OneToMany(_type => ProductItemEntity, productItem => productItem.product)
  @JoinTable({ name: "product_item" })
  public productItems: Array<ProductItemEntity>;

  // this is not a column
  public ordersCount: number;

  @Column({ type: "int" })
  public length: number;

  @Column({ type: "int" })
  public height: number;

  @Column({ type: "int" })
  public width: number;
}
