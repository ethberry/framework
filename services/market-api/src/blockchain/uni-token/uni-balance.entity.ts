import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

import { ns } from "@framework/constants";
import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-helpers";
import { IUniBalance } from "@framework/types";

import { UniTokenEntity } from "./uni-token.entity";

@Entity({ schema: ns, name: "uni_balance" })
export class UniBalanceEntity extends IdDateBaseEntity implements IUniBalance {
  @Column({ type: "varchar" })
  public account: string;

  @Column({ type: "numeric" })
  public amount: string;

  @Column({ type: "int" })
  public uniTokenId: number;

  @JoinColumn()
  @OneToOne(_type => UniTokenEntity)
  public uniToken: UniTokenEntity;
}
