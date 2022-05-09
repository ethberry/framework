import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";

import { Erc1155RecipeStatus, IErc1155Recipe } from "@framework/types";
import { ns } from "@framework/constants";
import { IdBaseEntity } from "@gemunion/nest-js-module-typeorm-helpers";

import { Erc1155IngredientEntity } from "../ingredient/ingredient.entity";
import { Erc1155TokenEntity } from "../token/token.entity";

@Entity({ schema: ns, name: "erc1155_recipe" })
export class Erc1155RecipeEntity extends IdBaseEntity implements IErc1155Recipe {
  @Column({ type: "varchar" })
  public erc1155TokenId: number;

  @Column({
    type: "enum",
    enum: Erc1155RecipeStatus,
  })
  public recipeStatus: Erc1155RecipeStatus;

  @JoinColumn()
  @OneToOne(_type => Erc1155TokenEntity)
  public erc1155Token: Erc1155TokenEntity;

  @OneToMany(_type => Erc1155IngredientEntity, ingredient => ingredient.erc1155Recipe)
  public ingredients: Array<Erc1155IngredientEntity>;
}
