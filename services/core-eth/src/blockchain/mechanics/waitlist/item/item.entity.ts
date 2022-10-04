import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-postgres";
import { ns } from "@framework/constants";
import { IWaitlistItem } from "@framework/types";
import { WaitlistListEntity } from "../list/list.entity";

@Entity({ schema: ns, name: "waitlist_item" })
export class WaitlistItemEntity extends IdDateBaseEntity implements IWaitlistItem {
  @Column({ type: "varchar" })
  public account: string;

  @Column({ type: "int" })
  public listId: number;

  @JoinColumn()
  @ManyToOne(_type => WaitlistListEntity, list => list.items)
  public list: WaitlistListEntity;
}
