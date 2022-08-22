import { Entity, OneToMany } from "typeorm";

import { IdBaseEntity } from "@gemunion/nest-js-module-typeorm-postgres";
import { ns } from "@framework/constants";
import { IAsset } from "@framework/types";

import { AssetComponentEntity } from "./asset-component.entity";

@Entity({ schema: ns, name: "asset" })
export class AssetEntity extends IdBaseEntity implements IAsset {
  @OneToMany(_type => AssetComponentEntity, component => component.asset)
  public components: Array<AssetComponentEntity>;
}
