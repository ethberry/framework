import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { Exclude } from "class-transformer";

import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-postgres";
import type { IGrade } from "@framework/types";
import { GradeStatus, GradeStrategy } from "@framework/types";
import { ns } from "@framework/constants";

import { ContractEntity } from "../../hierarchy/contract/contract.entity";
import { AssetEntity } from "../../exchange/asset/asset.entity";

@Entity({ schema: ns, name: "grade" })
export class GradeEntity extends IdDateBaseEntity implements IGrade {
  @Exclude()
  @Column({ type: "int" })
  public priceId: number;

  @JoinColumn()
  @OneToOne(_type => AssetEntity)
  public price: AssetEntity;

  @Column({
    type: "enum",
    enum: GradeStrategy,
  })
  public gradeStrategy: GradeStrategy;

  @Column({
    type: "enum",
    enum: GradeStatus,
  })
  public gradeStatus: GradeStatus;

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
