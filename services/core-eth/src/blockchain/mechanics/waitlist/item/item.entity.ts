import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-postgres";
import { ns } from "@framework/constants";
import type { IWaitListItem } from "@framework/types";
import { WaitListStatus } from "@framework/types";

import { WaitListListEntity } from "../list/list.entity";

@Entity({ schema: ns, name: "wait_list_item" })
export class WaitListItemEntity extends IdDateBaseEntity implements IWaitListItem {
  @Column({ type: "varchar" })
  public account: string;

  @Column({
    type: "enum",
    enum: WaitListStatus,
  })
  public waitListStatus: WaitListStatus;

  @Column({ type: "int" })
  public listId: number;

  @JoinColumn()
  @ManyToOne(_type => WaitListListEntity, list => list.items)
  public list: WaitListListEntity;
}
