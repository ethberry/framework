import { Column, Entity, ManyToOne, OneToMany, ManyToMany, JoinTable } from "typeorm";

import { ICategory } from "@gemunion/framework-types";
import { ns } from "@gemunion/framework-constants";
import { IdBaseEntity } from "@gemunion/nest-js-module-typeorm-helpers";

import { ProductEntity } from "../product/product.entity";

@Entity({ schema: ns, name: "category" })
export class CategoryEntity extends IdBaseEntity implements ICategory {
  @Column({ type: "varchar" })
  public title: string;

  @Column({
    type: "json",
    transformer: {
      from(val: Record<string, any>) {
        return JSON.stringify(val);
      },
      to(val: string) {
        return JSON.parse(val) as Record<string, any>;
      },
    },
  })
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
