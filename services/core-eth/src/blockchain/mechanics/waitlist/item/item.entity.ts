import { Column, Entity } from "typeorm";

import { ns } from "@framework/constants";
import { IWaitlistItem } from "@framework/types";
import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-postgres";

@Entity({ schema: ns, name: "waitlist" })
export class WaitlistItemEntity extends IdDateBaseEntity implements IWaitlistItem {
  @Column({ type: "varchar" })
  public account: string;

  @Column({ type: "int" })
  public listId: number;
}
