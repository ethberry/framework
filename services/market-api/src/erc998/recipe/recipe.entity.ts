import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";

import { Erc998RecipeStatus, IErc998Recipe } from "@framework/types";
import { ns } from "@framework/constants";
import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-helpers";

import { Erc998IngredientEntity } from "./ingredient/ingredient.entity";
import { Erc998TemplateEntity } from "../template/template.entity";
import { Erc998DropboxEntity } from "../dropbox/dropbox.entity";

@Entity({ schema: ns, name: "erc998_recipe" })
export class Erc998RecipeEntity extends IdDateBaseEntity implements IErc998Recipe {
  @Column({ type: "varchar" })
  public erc998TemplateId: number | null;

  @JoinColumn()
  @OneToOne(_type => Erc998TemplateEntity)
  public erc998Template: Erc998TemplateEntity;

  @Column({ type: "varchar" })
  public erc998DropboxId: number | null;

  @JoinColumn()
  @OneToOne(_type => Erc998DropboxEntity)
  public erc998Dropbox: Erc998DropboxEntity;

  @Column({
    type: "enum",
    enum: Erc998RecipeStatus,
  })
  public recipeStatus: Erc998RecipeStatus;

  @OneToMany(_type => Erc998IngredientEntity, ingredient => ingredient.erc998Recipe)
  public ingredients: Array<Erc998IngredientEntity>;
}
