import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import { CompositionStatus, IComposition } from "@framework/types";
import { ns } from "@framework/constants";
import { IdDateBaseEntity } from "@ethberry/nest-js-module-typeorm-postgres";

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
  @ManyToOne(_type => ContractEntity)
  public child: ContractEntity;

  @Column({ type: "int" })
  public amount: number;

  @Column({
    type: "enum",
    enum: CompositionStatus,
    default: CompositionStatus.ACTIVE,
  })
  public compositionStatus: CompositionStatus;
}
