import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-postgres";
import type { IMerge } from "@framework/types";
import { MergeStatus } from "@framework/types";
import { ns } from "@framework/constants";

import { MerchantEntity } from "../../../../infrastructure/merchant/merchant.entity";
import { AssetEntity } from "../../../exchange/asset/asset.entity";

@Entity({ schema: ns, name: "merge" })
export class MergeEntity extends IdDateBaseEntity implements IMerge {
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

  @Column({
    type: "enum",
    enum: MergeStatus,
  })
  public mergeStatus: MergeStatus;
}
