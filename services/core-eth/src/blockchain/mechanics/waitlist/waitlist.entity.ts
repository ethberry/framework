import { Column, Entity } from "typeorm";

import { ns } from "@framework/constants";
import { IWaitlist } from "@framework/types";
import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-postgres";

@Entity({ schema: ns, name: "waitlist" })
export class WaitlistEntity extends IdDateBaseEntity implements IWaitlist {
  @Column({ type: "varchar" })
  public account: string;

  @Column({ type: "int" })
  public listId: number;
}
