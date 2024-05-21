import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

import { ns } from "@framework/constants";
import type { ILootBox } from "@framework/types";
import { LootBoxStatus } from "@framework/types";
import { SearchableEntity } from "@gemunion/nest-js-module-typeorm-postgres";

import { TemplateEntity } from "../../../../hierarchy/template/template.entity";
import { AssetEntity } from "../../../../exchange/asset/asset.entity";

@Entity({ schema: ns, name: "loot_box" })
export class LootBoxEntity extends SearchableEntity implements ILootBox {
  @Column({ type: "varchar" })
  public imageUrl: string;

  @JoinColumn()
  @OneToOne(_type => AssetEntity)
  public item: AssetEntity;

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
}
