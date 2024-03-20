import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

import type { I2FA } from "@framework/types";
import { ns } from "@framework/constants";
import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-postgres";

import { UserEntity } from "../user/user.entity";

@Entity({ schema: ns, name: "2fa" })
export class TwoFAEntity extends IdDateBaseEntity implements I2FA {
  @Column({ type: "varchar", nullable: true })
  public secret: string | null;

  @Column({ type: "boolean" })
  public isActive: boolean;

  @Column({ type: "varchar", nullable: true })
  public endTimestamp: string | null;

  @JoinColumn()
  @OneToOne(_type => UserEntity)
  public user: UserEntity;

  @Column({ type: "int" })
  public userId: number;
}
