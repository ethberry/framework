import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany } from "typeorm";

import { SearchableEntity } from "@gemunion/nest-js-module-typeorm-postgres";
import { ICategory } from "@framework/types";
import { ns } from "@framework/constants";

import { ProductEntity } from "../product/product.entity";

@Entity({ schema: ns, name: "category" })
export class CategoryEntity extends SearchableEntity implements ICategory {
  @ManyToOne(_type => CategoryEntity, category => category.children)
  public parent: CategoryEntity;

  @Column({ type: "int" })
  public parentId: number;

  @OneToMany(_type => CategoryEntity, category => category.parent, {
    cascade: ["remove"],
  })
  public children: Array<CategoryEntity>;

  @ManyToMany(_type => ProductEntity, product => product.categories)
  @JoinTable({ name: "product_to_category" })
  public products: Array<ProductEntity>;
}
