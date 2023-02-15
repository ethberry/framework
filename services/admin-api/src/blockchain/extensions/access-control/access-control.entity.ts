import { Column, Entity } from "typeorm";

import { AccessControlRoleType, IAccessControl } from "@framework/types";
import { ns } from "@framework/constants";
import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-postgres";

@Entity({ schema: ns, name: "access_control" })
export class AccessControlEntity extends IdDateBaseEntity implements IAccessControl {
  @Column({ type: "varchar" })
  public address: string;

  @Column({ type: "varchar" })
  public account: string;

  @Column({
    type: "enum",
    enum: AccessControlRoleType,
  })
  public role: AccessControlRoleType;
}
