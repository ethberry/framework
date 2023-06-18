import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";

import { SearchableEntity } from "@gemunion/nest-js-module-typeorm-postgres";
import { ns } from "@framework/constants";
import { IWaitListList } from "@framework/types";

import { MerchantEntity } from "../../../../infrastructure/merchant/merchant.entity";
import { AssetEntity } from "../../../exchange/asset/asset.entity";
import { WaitListItemEntity } from "../item/item.entity";

@Entity({ schema: ns, name: "waitlist_list" })
export class WaitListListEntity extends SearchableEntity implements IWaitListList {
  @Column({ type: "int" })
  public merchantId: number;

  @JoinColumn()
  @OneToOne(_type => MerchantEntity)
  public merchant: MerchantEntity;

  @OneToMany(_type => WaitListItemEntity, item => item.list)
  public items: Array<WaitListItemEntity>;

  @JoinColumn()
  @OneToOne(_type => AssetEntity)
  public item: AssetEntity;

  @Column({ type: "int" })
  public itemId: number;
}
