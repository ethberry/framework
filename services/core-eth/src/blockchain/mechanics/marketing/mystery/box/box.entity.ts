import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

import { ns } from "@framework/constants";
import type { IMysteryBox } from "@framework/types";
import { MysteryBoxStatus } from "@framework/types";
import { SearchableEntity } from "@gemunion/nest-js-module-typeorm-postgres";

import { AssetEntity } from "../../../../exchange/asset/asset.entity";
import { TemplateEntity } from "../../../../hierarchy/template/template.entity";

@Entity({ schema: ns, name: "mystery_box" })
export class MysteryBoxEntity extends SearchableEntity implements IMysteryBox {
  @Column({ type: "varchar" })
  public imageUrl: string;

  @JoinColumn()
  @OneToOne(_type => AssetEntity)
  public content: AssetEntity;

  @Column({ type: "int" })
  public contentId: number;

  @Column({
    type: "enum",
    enum: MysteryBoxStatus,
  })
  public mysteryBoxStatus: MysteryBoxStatus;

  @Column({ type: "int" })
  public templateId: number;

  @JoinColumn()
  @OneToOne(_type => TemplateEntity)
  public template: TemplateEntity;
}
