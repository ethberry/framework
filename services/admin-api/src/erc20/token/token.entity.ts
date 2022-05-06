import { Column, Entity } from "typeorm";

import { Erc20TokenStatus, IErc20Token } from "@framework/types";
import { ns } from "@framework/constants";
import { BigNumberColumn, OzContractBaseEntity } from "@gemunion/nest-js-module-typeorm-helpers";

@Entity({ schema: ns, name: "erc20_token" })
export class Erc20TokenEntity extends OzContractBaseEntity implements IErc20Token {
  @Column({
    type: "enum",
    enum: Erc20TokenStatus,
  })
  public tokenStatus: Erc20TokenStatus;

  @Column({ type: "varchar" })
  public symbol: string;

  @BigNumberColumn()
  public amount: string;
}
