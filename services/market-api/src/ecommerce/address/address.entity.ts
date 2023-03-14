import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-postgres";
import { AddressStatus, IAddress } from "@framework/types";
import { ns } from "@framework/constants";

import { UserEntity } from "../../infrastructure/user/user.entity";

@Entity({ schema: ns, name: "address" })
export class AddressEntity extends IdDateBaseEntity implements IAddress {
  @Column({ type: "varchar" })
  public address: string;

  @JoinColumn()
  @OneToOne(_type => UserEntity)
  public user: UserEntity;

  @Column({ type: "int" })
  public userId: number;

  @Column({ type: "boolean" })
  public isDefault: boolean;

  @Column({
    type: "enum",
    enum: AddressStatus,
  })
  public addressStatus: AddressStatus;
}
