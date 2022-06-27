import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";

import { IErc721Ingredient } from "@framework/types";
import { ns } from "@framework/constants";
import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-helpers";

import { UniTemplateEntity } from "../../erc1155/token/token.entity";
import { CraftEntity } from "../recipe/recipe.entity";

@Entity({ schema: ns, name: "erc721_ingredient" })
export class Erc721IngredientEntity extends IdDateBaseEntity implements IErc721Ingredient {
  @Column({ type: "int" })
  public erc721RecipeId: number;

  @JoinColumn()
  @ManyToOne(_type => CraftEntity)
  public erc721Recipe: CraftEntity;

  @Column({ type: "int" })
  public erc1155TokenId: number;

  @JoinColumn()
  @OneToOne(_type => UniTemplateEntity)
  public erc1155Token: UniTemplateEntity;

  @Column({ type: "int" })
  public amount: number;
}
