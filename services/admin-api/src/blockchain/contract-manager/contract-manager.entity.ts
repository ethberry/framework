import { Column, Entity } from "typeorm";

import { ns } from "@framework/constants";
import { IContractManager, ContractType } from "@framework/types";
import { IdBaseEntity } from "@gemunion/nest-js-module-typeorm-helpers";

@Entity({ schema: ns, name: "system_manager" })
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
