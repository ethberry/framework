import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

import { IOtp, OtpType } from "@gemunion/framework-types";
import { ns } from "@gemunion/framework-constants";
import { UuidBaseEntity } from "@gemunion/nest-js-module-typeorm-helpers";

import { UserEntity } from "../user/user.entity";

@Entity({ schema: ns, name: "otp" })
export class OtpEntity extends UuidBaseEntity implements IOtp {
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
