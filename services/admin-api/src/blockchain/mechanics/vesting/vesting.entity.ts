import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-postgres";
import { IVesting, VestingContractTemplate } from "@framework/types";
import { ns } from "@framework/constants";
import { ContractEntity } from "../../hierarchy/contract/contract.entity";

@Entity({ schema: ns, name: "vesting" })
export class VestingEntity extends IdDateBaseEntity implements IVesting {
  @Column({ type: "varchar" })
  public account: string;

  @Column({ type: "int" })
  public duration: number;

  @Column({ type: "timestamptz" })
  public startTimestamp: string;

  @Column({
    type: "enum",
    enum: VestingContractTemplate,
  })
  public contractTemplate: VestingContractTemplate;

  @Column({ type: "int" })
  public contractId: number;

  @JoinColumn()
  @OneToOne(_type => ContractEntity)
  public contract: ContractEntity;
}
