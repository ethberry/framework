import { Column, Entity, OneToMany } from "typeorm";

import { IdBaseEntity } from "@gemunion/nest-js-module-typeorm-helpers";
import { ns } from "@framework/constants";
import { AssetType, IAsset } from "@framework/types";

import { AssetComponentEntity } from "./asset-component.entity";

@Entity({ schema: ns, name: "asset" })
export class AssetEntity extends IdBaseEntity implements IAsset {
  @OneToMany(_type => AssetComponentEntity, component => component.asset)
  public components: Array<AssetComponentEntity>;

  @Column({
    type: "enum",
    enum: AssetType,
  })
  public assetType: AssetType;

  @Column({ type: "int" })
  public externalId: number;
}
