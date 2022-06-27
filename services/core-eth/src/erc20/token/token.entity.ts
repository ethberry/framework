import { Column, Entity } from "typeorm";
import { Mixin } from "ts-mixer";

import { BigNumberColumn, ContractBaseEntity, SearchableEntity } from "@gemunion/nest-js-module-typeorm-helpers";
import { UniTokenStatus, Erc20TokenTemplate, IErc20Contract } from "@framework/types";
import { ns } from "@framework/constants";

@Entity({ schema: ns, name: "erc20_token" })
export class UniTemplateEntity extends Mixin(ContractBaseEntity, SearchableEntity) implements IErc20Contract {
  @Column({
    type: "enum",
    enum: UniTokenStatus,
  })
  public tokenStatus: UniTokenStatus;

  @Column({
    type: "enum",
    enum: Erc20TokenTemplate,
  })
  public contractTemplate: Erc20TokenTemplate;

  @Column({ type: "varchar" })
  public symbol: string;

  @Column({ type: "int" })
  public decimals: number;

  @Column({ type: "varchar" })
  public name: string;

  @BigNumberColumn()
  public amount: string;
}
