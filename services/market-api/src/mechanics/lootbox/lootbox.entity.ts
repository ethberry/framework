import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";

import { ns } from "@framework/constants";
import { ILootbox, LootboxStatus } from "@framework/types";
import { SearchableEntity } from "@gemunion/nest-js-module-typeorm-helpers";

import { TokenEntity } from "../../blockchain/hierarchy/token/token.entity";
import { AssetEntity } from "../asset/asset.entity";

@Entity({ schema: ns, name: "lootbox" })
export class LootboxEntity extends SearchableEntity implements ILootbox {
  @Column({ type: "varchar" })
  public imageUrl: string;

  @JoinColumn()
  @OneToOne(_type => AssetEntity)
  public price: AssetEntity;

  @JoinColumn()
  @OneToOne(_type => AssetEntity)
  public item: AssetEntity;

  @Column({
    type: "enum",
    enum: LootboxStatus,
  })
  public lootboxStatus: LootboxStatus;

  @OneToOne(_type => TokenEntity)
  public token: TokenEntity;
}
