import { Entity, JoinColumn, OneToMany } from "typeorm";

import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-helpers";
import { ns } from "@framework/constants";
import { IAsset } from "@framework/types";

import { AssetComponentEntity } from "./asset-component";

@Entity({ schema: ns, name: "uni_token" })
export class AssetEntity extends IdDateBaseEntity implements IAsset {
  @JoinColumn()
  @OneToMany(_type => AssetComponentEntity, component => component.priceId)
  public components: Array<AssetComponentEntity>;
}
