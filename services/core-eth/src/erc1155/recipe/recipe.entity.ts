import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";

import { Erc1155RecipeStatus, IErc1155Recipe } from "@framework/types";
import { ns } from "@framework/constants";
import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-helpers";

import { Erc1155IngredientEntity } from "../ingredient/ingredient.entity";
import { UniTemplateEntity } from "../token/token.entity";
import { Erc1155RecipeHistoryEntity } from "./recipe-history/recipe-history.entity";

@Entity({ schema: ns, name: "erc1155_recipe" })
export class Erc1155RecipeEntity extends IdDateBaseEntity implements IErc1155Recipe {
  @Column({ type: "varchar" })
  public erc1155TokenId: number;

  @Column({
    type: "enum",
    enum: Erc1155RecipeStatus,
  })
  public recipeStatus: Erc1155RecipeStatus;

  @JoinColumn()
  @OneToOne(_type => UniTemplateEntity)
  public erc1155Token: UniTemplateEntity;

  @OneToMany(_type => Erc1155IngredientEntity, ingredient => ingredient.erc1155Recipe)
  public ingredients: Array<Erc1155IngredientEntity>;

  @OneToMany(_type => Erc1155RecipeHistoryEntity, history => history.erc1155Recipe)
  public history: Array<Erc1155RecipeHistoryEntity>;
}
