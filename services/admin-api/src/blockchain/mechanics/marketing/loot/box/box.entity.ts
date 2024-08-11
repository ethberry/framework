import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

import { ns } from "@framework/constants";
import type { ILootBox } from "@framework/types";
import { LootBoxStatus } from "@framework/types";
import { SearchableEntity } from "@gemunion/nest-js-module-typeorm-postgres";

import { AssetEntity } from "../../../../exchange/asset/asset.entity";
import { TemplateEntity } from "../../../../hierarchy/template/template.entity";

@Entity({ schema: ns, name: "loot_box" })
export class LootBoxEntity extends SearchableEntity implements ILootBox {
  @Column({ type: "varchar" })
  public imageUrl: string;

  @JoinColumn()
  @OneToOne(_type => AssetEntity)
  public content: AssetEntity;

  @Column({ type: "int" })
  public contentId: number;

  @Column({
    type: "enum",
    enum: LootBoxStatus,
  })
  public lootBoxStatus: LootBoxStatus;

  @Column({ type: "int" })
  public templateId: number;

  @JoinColumn()
  @OneToOne(_type => TemplateEntity)
  public template: TemplateEntity;

  @Column({ type: "int" })
  public min: number;

  @Column({ type: "int" })
  public max: number;
}
