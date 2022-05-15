import { Column, Entity } from "typeorm";
import { Mixin } from "ts-mixer";

import { BigNumberColumn, ContractBaseEntity, SearchableEntity } from "@gemunion/nest-js-module-typeorm-helpers";
import { Erc20TokenStatus, IErc20Token } from "@framework/types";
import { ns } from "@framework/constants";

@Entity({ schema: ns, name: "erc20_token" })
export class Erc20TokenEntity extends Mixin(ContractBaseEntity, SearchableEntity) implements IErc20Token {
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
