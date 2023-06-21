import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

import { ns } from "@framework/constants";
import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-postgres";

import { UserEntity } from "../../infrastructure/user/user.entity";

@Entity({ schema: ns, name: "game_balance" })
export class BalanceEntity extends IdDateBaseEntity {
  @Column({ type: "int" })
  public userId: number;

  @JoinColumn()
  @OneToOne(_type => UserEntity)
  public user: UserEntity;

  @Column({ type: "int" })
  public amount: number;
}
