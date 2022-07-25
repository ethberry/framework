import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

import { ns } from "@framework/constants";
import { ILootbox, LootboxStatus } from "@framework/types";
import { SearchableEntity } from "@gemunion/nest-js-module-typeorm-helpers";

import { TemplateEntity } from "../../blockchain/hierarchy/template/template.entity";
import { AssetEntity } from "../asset/asset.entity";

@Entity({ schema: ns, name: "lootbox" })
export class LootboxEntity extends SearchableEntity implements ILootbox {
  @Column({ type: "varchar" })
  public imageUrl: string;

  @Column({ type: "int" })
  public priceId: number;

  @JoinColumn()
  @OneToOne(_type => AssetEntity)
  public price: AssetEntity;

  @JoinColumn()
  @OneToOne(_type => AssetEntity)
  public item: AssetEntity;

  @Column({
    type: "enum",
    enum: LootboxStatus,
  })
  public lootboxStatus: LootboxStatus;

  @Column({ type: "int" })
  public templateId: number;

  @OneToOne(_type => TemplateEntity)
  public template: TemplateEntity;
}
