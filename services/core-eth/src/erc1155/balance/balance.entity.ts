import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-helpers";
import { ns } from "@framework/constants";
import { IUniBalance } from "@framework/types";

import { UniTokenEntity } from "../../blockchain/uni-token/uni-token.entity";

@Entity({ schema: ns, name: "erc1155_balance" })
export class Erc1155BalanceEntity extends IdDateBaseEntity implements IUniBalance {
  @Column({ type: "varchar" })
  public account: string;

  @Column({ type: "varchar" })
  public amount: string;

  @Column({ type: "int" })
  public uniTokenId: number;

  @JoinColumn()
  @OneToOne(_type => UniTokenEntity)
  public uniToken: UniTokenEntity;
}
