import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-postgres";
import type { ICraft } from "@framework/types";
import { CraftStatus } from "@framework/types";
import { ns } from "@framework/constants";

import { MerchantEntity } from "../../../infrastructure/merchant/merchant.entity";
import { AssetEntity } from "../../exchange/asset/asset.entity";

@Entity({ schema: ns, name: "craft" })
export class CraftEntity extends IdDateBaseEntity implements ICraft {
  @JoinColumn()
  @OneToOne(_type => AssetEntity)
  public item: AssetEntity;

  @JoinColumn()
  @OneToOne(_type => AssetEntity)
  public price: AssetEntity;

  @Column({ type: "int" })
  public merchantId: number;

  @JoinColumn()
  @OneToOne(_type => MerchantEntity)
  public merchant: MerchantEntity;

  @Column({ type: "boolean" })
  public inverse: boolean;

  @Column({
    type: "enum",
    enum: CraftStatus,
  })
  public craftStatus: CraftStatus;
}
