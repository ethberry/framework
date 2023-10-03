import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

import type { IOtp } from "@framework/types";
import { OtpType } from "@framework/types";
import { ns } from "@framework/constants";
import { UuidDateBaseEntity } from "@gemunion/nest-js-module-typeorm-postgres";

import { UserEntity } from "../user/user.entity";

@Entity({ schema: ns, name: "otp" })
export class OtpEntity extends UuidDateBaseEntity implements IOtp {
  @Column({
    type: "enum",
    enum: OtpType,
  })
  public otpType: OtpType;

  @JoinColumn()
  @OneToOne(_type => UserEntity)
  public user: UserEntity;

  @Column({ type: "int" })
  public userId: number;

  @Column({ type: "json" })
  public data: any;
}
