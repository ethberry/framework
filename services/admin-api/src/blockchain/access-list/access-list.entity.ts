import { Column, Entity } from "typeorm";

import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-postgres";
import { IAccessList } from "@framework/types";
import { ns } from "@framework/constants";

@Entity({ schema: ns, name: "access_list" })
export class AccessListEntity extends IdDateBaseEntity implements IAccessList {
  @Column({ type: "varchar" })
  public address: string;

  @Column({ type: "varchar" })
  public account: string;

  @Column({ type: "boolean" })
  public allowance: boolean;
}
