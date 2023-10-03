import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany } from "typeorm";

import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-postgres";
import type { ICategory } from "@framework/types";
import { ns } from "@framework/constants";

import { ProductEntity } from "../product/product.entity";

@Entity({ schema: ns, name: "category" })
export class CategoryEntity extends IdDateBaseEntity implements ICategory {
  @Column({ type: "varchar" })
  public title: string;

  @Column({ type: "json" })
  public description: string;

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
