import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";

import { ExchangeStatus, IErc721Recipe } from "@framework/types";
import { ns } from "@framework/constants";
import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-helpers";

import { Erc721IngredientEntity } from "../ingredient/ingredient.entity";
import { UniTemplateEntity } from "../template/template.entity";
import { Erc721DropboxEntity } from "../dropbox/dropbox.entity";
import { Erc721RecipeHistoryEntity } from "./recipe-history/recipe-history.entity";

@Entity({ schema: ns, name: "erc721_recipe" })
export class CraftEntity extends IdDateBaseEntity implements IErc721Recipe {
  @Column({ type: "varchar" })
  public erc721TemplateId: number | null;

  @JoinColumn()
  @OneToOne(_type => UniTemplateEntity)
  public erc721Template: UniTemplateEntity;

  @Column({ type: "varchar" })
  public erc721DropboxId: number | null;

  @JoinColumn()
  @OneToOne(_type => Erc721DropboxEntity)
  public erc721Dropbox: Erc721DropboxEntity;

  @Column({
    type: "enum",
    enum: ExchangeStatus,
  })
  public recipeStatus: ExchangeStatus;

  @OneToMany(_type => Erc721IngredientEntity, ingredient => ingredient.erc721Recipe)
  public ingredients: Array<Erc721IngredientEntity>;

  @OneToMany(_type => Erc721RecipeHistoryEntity, history => history.erc721Recipe)
  public history: Array<Erc721RecipeHistoryEntity>;
}
