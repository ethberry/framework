import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-postgres";
import type { IWalletPayee } from "@framework/types";
import { ns } from "@framework/constants";
import { ContractEntity } from "../../hierarchy/contract/contract.entity";

@Entity({ schema: ns, name: "payees" })
export class PayeesEntity extends IdDateBaseEntity implements IWalletPayee {
  @Column({ type: "varchar" })
  public account: string;

  @Column({ type: "int" })
  public shares: number;

  @Column({ type: "int" })
  public contractId: number;

  @JoinColumn()
  @OneToOne(_type => ContractEntity)
  public contract: ContractEntity;
}
