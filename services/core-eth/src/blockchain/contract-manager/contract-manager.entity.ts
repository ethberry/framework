import { Column, Entity } from "typeorm";

import { ns } from "@framework/constants";
import { ContractType, IContractManager } from "@framework/types";
import { IdBaseEntity } from "@gemunion/nest-js-module-typeorm-helpers";

@Entity({ schema: ns, name: "contract_manager" })
export class ContractManagerEntity extends IdBaseEntity implements IContractManager {
  @Column({ type: "varchar" })
  public address: string;

  @Column({ type: "int" })
  public fromBlock: number;

  @Column({
    type: "enum",
    enum: ContractType,
  })
  public contractType: ContractType;
}
