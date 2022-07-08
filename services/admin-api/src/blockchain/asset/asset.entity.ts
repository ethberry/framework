import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Exclude } from "class-transformer";

import { IdBaseEntity } from "@gemunion/nest-js-module-typeorm-helpers";
import { ns } from "@framework/constants";
import { AssetType, IAsset } from "@framework/types";

import { AssetComponentEntity } from "./asset-component.entity";

@Entity({ schema: ns, name: "asset" })
export class AssetEntity extends IdBaseEntity implements IAsset {
  @Exclude()
  @PrimaryGeneratedColumn()
  public id: number;

  @OneToMany(_type => AssetComponentEntity, component => component.asset)
  public components: Array<AssetComponentEntity>;

  @Exclude()
  @Column({
    type: "enum",
    enum: AssetType,
  })
  public assetType: AssetType;

  @Exclude()
  @Column({ type: "numeric" })
  public externalId: string;
}
