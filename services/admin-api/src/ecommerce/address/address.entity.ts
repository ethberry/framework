import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import { ns } from "@framework/constants";
import { AddressStatus, IAddress } from "@framework/types";
import { EnabledCountries } from "@gemunion/constants";
import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-postgres";

import { UserEntity } from "../../infrastructure/user/user.entity";

@Entity({ schema: ns, name: "address" })
export class AddressEntity extends IdDateBaseEntity implements IAddress {
  @Column({ type: "varchar" })
  public addressLine1: string;

  @Column({ type: "varchar", nullable: true })
  public addressLine2: string;

  @Column({ type: "varchar" })
  public city: string;

  @Column({
    type: "enum",
    enum: EnabledCountries,
  })
  public country: EnabledCountries;

  @Column({ type: "varchar", nullable: true })
  public state: string;

  @Column({ type: "varchar" })
  public zip: string;

  @JoinColumn()
  @ManyToOne(_type => UserEntity, user => user.addresses)
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
