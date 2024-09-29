import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { Exclude } from "class-transformer";

import { IdDateBaseEntity } from "@ethberry/nest-js-module-typeorm-postgres";
import type { IDiscrete } from "@framework/types";
import { DiscreteStatus, DiscreteStrategy } from "@framework/types";
import { ns } from "@framework/constants";

import { ContractEntity } from "../../../hierarchy/contract/contract.entity";
import { AssetEntity } from "../../../exchange/asset/asset.entity";

@Entity({ schema: ns, name: "discrete" })
export class DiscreteEntity extends IdDateBaseEntity implements IDiscrete {
  @Exclude()
  @Column({ type: "int" })
  public priceId: number;

  @JoinColumn()
  @OneToOne(_type => AssetEntity)
  public price: AssetEntity;

  @Column({
    type: "enum",
    enum: DiscreteStrategy,
  })
  public discreteStrategy: DiscreteStrategy;

  @Column({
    type: "enum",
    enum: DiscreteStatus,
  })
  public discreteStatus: DiscreteStatus;

  @Column({ type: "int" })
  public contractId: number;

  @JoinColumn()
  @ManyToOne(_type => ContractEntity)
  public contract: ContractEntity;

  @Column({ type: "float" })
  public growthRate: number;

  @Column({ type: "varchar" })
  public attribute: string;
}
