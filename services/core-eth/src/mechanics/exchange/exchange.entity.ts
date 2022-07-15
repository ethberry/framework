import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

import { CraftStatus, ICraft } from "@framework/types";
import { ns } from "@framework/constants";
import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-helpers";
import { AssetEntity } from "../asset/asset.entity";

@Entity({ schema: ns, name: "recipe" })
export class ExchangeEntity extends IdDateBaseEntity implements ICraft {
  @JoinColumn()
  @OneToOne(_type => AssetEntity)
  public item: AssetEntity;

  @JoinColumn()
  @OneToOne(_type => AssetEntity)
  public ingredients: AssetEntity;

  @Column({
    type: "enum",
    enum: CraftStatus,
  })
  public craftStatus: CraftStatus;
}
