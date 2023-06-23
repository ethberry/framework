import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";

import { SearchableEntity } from "@gemunion/nest-js-module-typeorm-postgres";
import { ns } from "@framework/constants";
import { IWaitListList } from "@framework/types";

import { AssetEntity } from "../../../exchange/asset/asset.entity";
import { WaitListItemEntity } from "../item/item.entity";
import { ContractEntity } from "../../../hierarchy/contract/contract.entity";

@Entity({ schema: ns, name: "wait_list_list" })
export class WaitListListEntity extends SearchableEntity implements IWaitListList {
  @OneToMany(_type => WaitListItemEntity, item => item.list)
  public items: Array<WaitListItemEntity>;

  @Column({ type: "varchar" })
  public root: string;

  @JoinColumn()
  @OneToOne(_type => AssetEntity)
  public item: AssetEntity;

  @Column({ type: "int" })
  public itemId: number;

  @Column({ type: "int" })
  public contractId: number;

  @JoinColumn()
  @OneToOne(_type => ContractEntity)
  public contract: ContractEntity;
}
