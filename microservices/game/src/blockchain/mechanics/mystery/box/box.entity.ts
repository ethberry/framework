import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

import { ns } from "@framework/constants";
import { IMysteryBox, MysteryBoxStatus } from "@framework/types";
import { SearchableEntity } from "@gemunion/nest-js-module-typeorm-postgres";

import { TemplateEntity } from "../../../hierarchy/template/template.entity";
import { AssetEntity } from "../../../exchange/asset/asset.entity";

@Entity({ schema: ns, name: "mysterybox" })
export class MysteryBoxEntity extends SearchableEntity implements IMysteryBox {
  @Column({ type: "varchar" })
  public imageUrl: string;

  @JoinColumn()
  @OneToOne(_type => AssetEntity)
  public item: AssetEntity;

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
