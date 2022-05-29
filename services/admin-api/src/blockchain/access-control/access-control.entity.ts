import { Column, Entity } from "typeorm";

import { IAccessControl, AccessControlRoleType } from "@framework/types";
import { ns } from "@framework/constants";
import { IdBaseEntity } from "@gemunion/nest-js-module-typeorm-helpers";

@Entity({ schema: ns, name: "access_control" })
export class AccessControlEntity extends IdBaseEntity implements IAccessControl {
  @Column({ type: "varchar" })
  public address: string;

  @Column({ type: "varchar" })
  public wallet: string;

  @Column({
    type: "enum",
    enum: AccessControlRoleType,
  })
  public role: AccessControlRoleType;
}
