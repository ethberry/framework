import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { BigNumber } from "ethers";

import { BigNumberColumn, IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-helpers";
import { ns } from "@framework/constants";
import { IErc1155Balance } from "@framework/types";

import { UniTemplateEntity } from "../token/token.entity";

@Entity({ schema: ns, name: "erc1155_balance" })
export class Erc1155BalanceEntity extends IdDateBaseEntity implements IErc1155Balance {
  @Column({ type: "varchar" })
  public wallet: string;

  @BigNumberColumn()
  public amount: BigNumber;

  @Column({ type: "int" })
  public erc1155TokenId: number;

  @JoinColumn()
  @OneToOne(_type => UniTemplateEntity)
  public erc1155Token: UniTemplateEntity;
}
