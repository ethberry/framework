import { Entity, JoinColumn, OneToMany, Column } from "typeorm";

import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-helpers";
import { ns } from "@framework/constants";
import { AssetType, IAsset } from "@framework/types";

import { AssetComponentEntity } from "./asset-component.entity";

@Entity({ schema: ns, name: "uni_token" })
export class AssetEntity extends IdDateBaseEntity implements IAsset {
  @JoinColumn()
  @OneToMany(_type => AssetComponentEntity, component => component.assetId)
  public components: Array<AssetComponentEntity>;

  @Column({
    type: "enum",
    enum: AssetType,
  })
  public assetType: AssetType;

  @Column({ type: "int" })
  public externalId: number;
}
