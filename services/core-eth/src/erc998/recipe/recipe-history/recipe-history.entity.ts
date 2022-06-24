import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import { ns } from "@framework/constants";
import { Erc998RecipeEventType, IErc998RecipeHistory, TErc998RecipeEventData } from "@framework/types";
import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-helpers";

import { Erc998RecipeEntity } from "../recipe.entity";

@Entity({ schema: ns, name: "erc998_recipe_history" })
export class Erc998RecipeHistoryEntity extends IdDateBaseEntity implements IErc998RecipeHistory {
  @Column({ type: "varchar" })
  public address: string;

  @Column({ type: "varchar" })
  public transactionHash: string;

  @Column({
    type: "enum",
    enum: Erc998RecipeEventType,
  })
  public eventType: Erc998RecipeEventType;

  @Column({ type: "json" })
  public eventData: TErc998RecipeEventData;

  @Column({ type: "int", nullable: true })
  public erc998RecipeId: number | null;

  @JoinColumn()
  @ManyToOne(_type => Erc998RecipeEntity, recipe => recipe.history)
  public erc998Recipe?: Erc998RecipeEntity;
}
