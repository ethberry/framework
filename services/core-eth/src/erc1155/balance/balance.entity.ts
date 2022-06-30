import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-helpers";
import { ns } from "@framework/constants";
import { IBalance } from "@framework/types";

import { TokenEntity } from "../../blockchain/uni-token/uni-token/uni-token.entity";

@Entity({ schema: ns, name: "erc1155_balance" })
export class Erc1155BalanceEntity extends IdDateBaseEntity implements IBalance {
  @Column({ type: "varchar" })
  public account: string;

  @Column({ type: "varchar" })
  public amount: string;

  @Column({ type: "int" })
  public tokenId: number;

  @JoinColumn()
  @OneToOne(_type => TokenEntity)
  public token: TokenEntity;
}
