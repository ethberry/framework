import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import { ns } from "@framework/constants";
import { Erc721RecipeEventType, IErc721RecipeHistory, TErc721RecipeEventData } from "@framework/types";
import { IdBaseEntity } from "@gemunion/nest-js-module-typeorm-helpers";

import { Erc721RecipeEntity } from "../recipe.entity";

@Entity({ schema: ns, name: "erc721_recipe_history" })
export class Erc721RecipeHistoryEntity extends IdBaseEntity implements IErc721RecipeHistory {
  @Column({ type: "varchar" })
  public address: string;

  @Column({ type: "varchar" })
  public transactionHash: string;

  @Column({
    type: "enum",
    enum: Erc721RecipeEventType,
  })
  public eventType: Erc721RecipeEventType;

  @Column({ type: "json" })
  public eventData: TErc721RecipeEventData;

  @Column({ type: "int", nullable: true })
  public erc721RecipeId: number | null;

  @JoinColumn()
  @ManyToOne(_type => Erc721RecipeEntity, recipe => recipe.history)
  public erc721Recipe?: Erc721RecipeEntity;
}
