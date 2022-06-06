import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import { ns } from "@framework/constants";
import { Erc1155RecipeEventType, IErc1155RecipeHistory, TErc1155RecipeEventData } from "@framework/types";
import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-helpers";

import { Erc1155RecipeEntity } from "../recipe.entity";

@Entity({ schema: ns, name: "erc1155_recipe_history" })
export class Erc1155RecipeHistoryEntity extends IdDateBaseEntity implements IErc1155RecipeHistory {
  @Column({ type: "varchar" })
  public address: string;

  @Column({ type: "varchar" })
  public transactionHash: string;

  @Column({
    type: "enum",
    enum: Erc1155RecipeEventType,
  })
  public eventType: Erc1155RecipeEventType;

  @Column({ type: "json" })
  public eventData: TErc1155RecipeEventData;

  @Column({ type: "int", nullable: true })
  public erc1155RecipeId: number | null;

  @JoinColumn()
  @ManyToOne(_type => Erc1155RecipeEntity, recipe => recipe.history)
  public erc1155Recipe?: Erc1155RecipeEntity;
}
