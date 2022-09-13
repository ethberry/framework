import { Column, Entity } from "typeorm";

import { ns } from "@framework/constants";
import { IWhitelist } from "@framework/types";
import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-postgres";

@Entity({ schema: ns, name: "whitelist" })
export class WhitelistEntity extends IdDateBaseEntity implements IWhitelist {
  @Column({ type: "varchar" })
  public account: string;
}
