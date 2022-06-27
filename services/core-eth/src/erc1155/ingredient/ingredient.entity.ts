import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";

import { IErc1155Ingredient } from "@framework/types";
import { ns } from "@framework/constants";
import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-helpers";

import { UniTemplateEntity } from "../token/token.entity";
import { Erc1155RecipeEntity } from "../recipe/recipe.entity";

@Entity({ schema: ns, name: "erc1155_ingredient" })
export class Erc1155IngredientEntity extends IdDateBaseEntity implements IErc1155Ingredient {
  @Column({ type: "int" })
  public erc1155RecipeId: number;

  @JoinColumn()
  @ManyToOne(_type => Erc1155RecipeEntity)
  public erc1155Recipe: Erc1155RecipeEntity;

  @Column({ type: "int" })
  public erc1155TokenId: number;

  @JoinColumn()
  @OneToOne(_type => UniTemplateEntity)
  public erc1155Token: UniTemplateEntity;

  @Column({ type: "int" })
  public amount: number;
}
