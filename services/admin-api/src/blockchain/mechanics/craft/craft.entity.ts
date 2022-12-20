import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

import { CraftStatus, ICraft } from "@framework/types";
import { ns } from "@framework/constants";
import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-postgres";

import { AssetEntity } from "../../exchange/asset/asset.entity";

@Entity({ schema: ns, name: "craft" })
export class CraftEntity extends IdDateBaseEntity implements ICraft {
  @JoinColumn()
  @OneToOne(_type => AssetEntity)
  public item: AssetEntity;

  @JoinColumn()
  @OneToOne(_type => AssetEntity)
  public price: AssetEntity;

  @Column({
    type: "enum",
    enum: CraftStatus,
  })
  public craftStatus: CraftStatus;
}
