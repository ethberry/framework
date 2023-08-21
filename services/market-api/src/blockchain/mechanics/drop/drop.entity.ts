import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-postgres";
import { ns } from "@framework/constants";
import { IDrop } from "@framework/types";

import { AssetEntity } from "../../exchange/asset/asset.entity";
import { MerchantEntity } from "../../../infrastructure/merchant/merchant.entity";
import { MysteryBoxEntity } from "../mystery/box/box.entity";

@Entity({ schema: ns, name: "drop" })
export class DropEntity extends IdDateBaseEntity implements IDrop {
  @Column({ type: "int" })
  public merchantId: number;

  @JoinColumn()
  @OneToOne(_type => MerchantEntity)
  public merchant: MerchantEntity;

  @JoinColumn()
  @OneToOne(_type => AssetEntity)
  public item: AssetEntity;

  @JoinColumn()
  @OneToOne(_type => AssetEntity)
  public price: AssetEntity;

  @Column({ type: "timestamptz" })
  public startTimestamp: string;

  @Column({ type: "timestamptz" })
  public endTimestamp: string;

  public box?: MysteryBoxEntity;
}
