import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

import { CraftStatus, IRecipe } from "@framework/types";
import { ns } from "@framework/constants";
import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-helpers";

import { AssetEntity } from "../asset/asset.entity";

@Entity({ schema: ns, name: "recipe" })
export class CraftEntity extends IdDateBaseEntity implements IRecipe {
  @JoinColumn()
  @OneToOne(_type => AssetEntity)
  public item: AssetEntity;

  @JoinColumn()
  @OneToOne(_type => AssetEntity)
  public ingredients: AssetEntity;

  @Column({
    type: "enum",
    enum: CraftStatus,
  })
  public craftStatus: CraftStatus;
}
