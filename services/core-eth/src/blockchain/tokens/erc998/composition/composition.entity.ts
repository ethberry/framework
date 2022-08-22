import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";

import { IComposition } from "@framework/types";
import { ns } from "@framework/constants";
import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-helpers";

import { ContractEntity } from "../../../hierarchy/contract/contract.entity";

@Entity({ schema: ns, name: "composition" })
export class CompositionEntity extends IdDateBaseEntity implements IComposition {
  @Column({ type: "int" })
  public parentId: number;

  @JoinColumn()
  @ManyToOne(_type => ContractEntity)
  public parent: ContractEntity;

  @Column({ type: "int" })
  public childId: number;

  @JoinColumn()
  @OneToOne(_type => ContractEntity)
  public child: ContractEntity;

  @Column({ type: "int" })
  public amount: number;
}
