import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

import { ns } from "@framework/constants";
import { IMysterybox, MysteryboxStatus } from "@framework/types";
import { SearchableEntity } from "@gemunion/nest-js-module-typeorm-postgres";

import { AssetEntity } from "../../../exchange/asset/asset.entity";
import { TemplateEntity } from "../../../hierarchy/template/template.entity";

@Entity({ schema: ns, name: "mysterybox" })
export class MysteryBoxEntity extends SearchableEntity implements IMysterybox {
  @Column({ type: "varchar" })
  public imageUrl: string;

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
