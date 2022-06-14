import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";

import { IErc998Ingredient } from "@framework/types";
import { ns } from "@framework/constants";
import { IdBaseEntity } from "@gemunion/nest-js-module-typeorm-helpers";

import { Erc1155TokenEntity } from "../../../erc1155/token/token.entity";
import { Erc998RecipeEntity } from "../recipe.entity";

@Entity({ schema: ns, name: "erc998_ingredient" })
export class Erc998IngredientEntity extends IdBaseEntity implements IErc998Ingredient {
  @Column({ type: "int" })
  public erc998RecipeId: number;

  @JoinColumn()
  @ManyToOne(_type => Erc998RecipeEntity, recipe => recipe.ingredients)
  public erc998Recipe: Erc998RecipeEntity;

  @Column({ type: "int" })
  public erc1155TokenId: number;

  @JoinColumn()
  @OneToOne(_type => Erc1155TokenEntity)
  public erc1155Token: Erc1155TokenEntity;

  @Column({ type: "int" })
  public amount: number;
}
