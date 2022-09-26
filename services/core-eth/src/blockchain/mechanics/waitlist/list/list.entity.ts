import { Entity, OneToMany } from "typeorm";

import { SearchableEntity } from "@gemunion/nest-js-module-typeorm-postgres";
import { ns } from "@framework/constants";
import { IWaitlistList } from "@framework/types";

import { WaitlistItemEntity } from "../item/item.entity";

@Entity({ schema: ns, name: "waitlist_list" })
export class WaitlistListEntity extends SearchableEntity implements IWaitlistList {
  @OneToMany(_type => WaitlistItemEntity, item => item.list)
  public items: Array<WaitlistItemEntity>;
}
