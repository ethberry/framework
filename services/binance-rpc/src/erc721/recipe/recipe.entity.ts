import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";

import { Erc721RecipeStatus, IErc721Recipe } from "@framework/types";
import { ns } from "@framework/constants";
import { IdBaseEntity } from "@gemunion/nest-js-module-typeorm-helpers";

import { Erc721IngredientEntity } from "../ingredient/ingredient.entity";
import { Erc721TemplateEntity } from "../template/template.entity";
import { Erc721DropboxEntity } from "../dropbox/dropbox.entity";
import { Erc721RecipeHistoryEntity } from "../recipe-history/recipe-history.entity";

@Entity({ schema: ns, name: "erc721_recipe" })
export class Erc721RecipeEntity extends IdBaseEntity implements IErc721Recipe {
  @Column({ type: "varchar" })
  public erc721TemplateId: number | null;

  @JoinColumn()
  @OneToOne(_type => Erc721TemplateEntity)
  public erc721Template: Erc721TemplateEntity;

  @Column({ type: "varchar" })
  public erc721DropboxId: number | null;

  @JoinColumn()
  @OneToOne(_type => Erc721DropboxEntity)
  public erc721Dropbox: Erc721DropboxEntity;

  @Column({
    type: "enum",
    enum: Erc721RecipeStatus,
  })
  public recipeStatus: Erc721RecipeStatus;

  @OneToMany(_type => Erc721IngredientEntity, ingredient => ingredient.erc721Recipe)
  public ingredients: Array<Erc721IngredientEntity>;

  @OneToMany(_type => Erc721RecipeHistoryEntity, history => history.erc721Recipe)
  public history: Array<Erc721RecipeHistoryEntity>;
}
