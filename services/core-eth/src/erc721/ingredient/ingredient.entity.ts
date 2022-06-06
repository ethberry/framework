import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";

import { IErc721Ingredient } from "@framework/types";
import { ns } from "@framework/constants";
import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-helpers";

import { Erc1155TokenEntity } from "../../erc1155/token/token.entity";
import { Erc721RecipeEntity } from "../recipe/recipe.entity";

@Entity({ schema: ns, name: "erc721_ingredient" })
export class Erc721IngredientEntity extends IdDateBaseEntity implements IErc721Ingredient {
  @Column({ type: "int" })
  public erc721RecipeId: number;

  @JoinColumn()
  @ManyToOne(_type => Erc721RecipeEntity)
  public erc721Recipe: Erc721RecipeEntity;

  @Column({ type: "int" })
  public erc1155TokenId: number;

  @JoinColumn()
  @OneToOne(_type => Erc1155TokenEntity)
  public erc1155Token: Erc1155TokenEntity;

  @Column({ type: "int" })
  public amount: number;
}
