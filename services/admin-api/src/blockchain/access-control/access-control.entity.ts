import { Column, Entity } from "typeorm";

import { IAccessControl, AccessControlRoleHash } from "@framework/types";
import { ns } from "@framework/constants";
import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-helpers";

@Entity({ schema: ns, name: "access_control" })
export class AccessControlEntity extends IdDateBaseEntity implements IAccessControl {
  @Column({ type: "varchar" })
  public address: string;

  @Column({ type: "varchar" })
  public wallet: string;

  @Column({
    type: "enum",
    enum: AccessControlRoleHash,
  })
  public role: AccessControlRoleHash;
}
