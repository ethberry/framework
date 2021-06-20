import {Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";

import {ICategory} from "@trejgun/solo-types";
import {ns} from "@trejgun/solo-constants-misc";

import {ProductEntity} from "../product/product.entity";
import {BaseEntity} from "../common/base.entity";

@Entity({schema: ns, name: "category"})
export class CategoryEntity extends BaseEntity implements ICategory {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public title: string;

  @Column()
  public description: string;

  @ManyToOne(_type => CategoryEntity, category => category.children)
  public parent: CategoryEntity;

  @Column({type: "int"})
  public parentId: number;

  @OneToMany(_type => CategoryEntity, category => category.parent, {
    cascade: ["remove"],
  })
  public children: Array<CategoryEntity>;

  @ManyToMany(_type => ProductEntity, product => product.categories)
  @JoinTable({name: "product_to_category"})
  public products: Array<ProductEntity>;
}
