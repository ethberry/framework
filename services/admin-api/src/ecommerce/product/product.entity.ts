import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany } from "typeorm";

import { IProduct, ProductStatus } from "@framework/types";
import { ns } from "@framework/constants";
import { SearchableEntity } from "@gemunion/nest-js-module-typeorm-postgres";

import { MerchantEntity } from "../../infrastructure/merchant/merchant.entity";
import { CategoryEntity } from "../category/category.entity";
import { PhotoEntity } from "../photo/photo.entity";
import { ProductItemEntity } from "../product-item/product-item.entity";

@Entity({ schema: ns, name: "product" })
export class ProductEntity extends SearchableEntity implements IProduct {
  @ManyToMany(_type => CategoryEntity, category => category.products)
  @JoinTable({ name: "product_to_category" })
  public categories: Array<CategoryEntity>;

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
  public productItems: Array<ProductItemEntity>;

  @Column({ type: "int" })
  public length: number;

  @Column({ type: "int" })
  public height: number;

  @Column({ type: "int" })
  public width: number;

  @Column({ type: "int" })
  public weight: number;
}
