import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { BigNumber } from "ethers";

import { BigNumberColumn, IdBaseEntity } from "@gemunion/nest-js-module-typeorm-helpers";
import { ns } from "@framework/constants";
import { IErc1155Balance } from "@framework/types";

import { Erc1155TokenEntity } from "../token/token.entity";

@Entity({ schema: ns, name: "erc1155_balance" })
export class Erc1155BalanceEntity extends IdBaseEntity implements IErc1155Balance {
  @Column({ type: "varchar" })
  public wallet: string;

  @BigNumberColumn()
  public amount: BigNumber;

  @Column({ type: "int" })
  public erc1155TokenId: number;

  @JoinColumn()
  @OneToOne(_type => Erc1155TokenEntity)
  public erc1155Token: Erc1155TokenEntity;
}
