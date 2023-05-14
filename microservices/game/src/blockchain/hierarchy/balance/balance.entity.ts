import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";

import { ns } from "@framework/constants";
import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-postgres";
import { IBalance } from "@framework/types";

import { TokenEntity } from "../token/token.entity";

@Entity({ schema: ns, name: "balance" })
export class BalanceEntity extends IdDateBaseEntity implements IBalance {
  @Column({ type: "varchar" })
  public account: string;

  @Column({ type: "numeric" })
  public amount: string;

  @Column({ type: "int" })
  public tokenId: number;

  @JoinColumn()
  @ManyToOne(_type => TokenEntity)
  public token: TokenEntity;

  @Column({ type: "int", nullable: true })
  public targetId: number | null;

  @JoinColumn()
  @OneToOne(_type => TokenEntity)
  public target: TokenEntity;
}
