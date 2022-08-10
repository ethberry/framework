import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

import { ns } from "@framework/constants";
import { IMysterybox, MysteryboxStatus } from "@framework/types";
import { SearchableEntity } from "@gemunion/nest-js-module-typeorm-helpers";

import { TemplateEntity } from "../../hierarchy/template/template.entity";
import { AssetEntity } from "../asset/asset.entity";

@Entity({ schema: ns, name: "mysterybox" })
export class MysteryboxEntity extends SearchableEntity implements IMysterybox {
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
    enum: MysteryboxStatus,
  })
  public mysteryboxStatus: MysteryboxStatus;

  @Column({ type: "int" })
  public templateId: number;

  @JoinColumn()
  @OneToOne(_type => TemplateEntity)
  public template: TemplateEntity;
}
