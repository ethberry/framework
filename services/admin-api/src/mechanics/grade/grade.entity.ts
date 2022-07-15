import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { Exclude } from "class-transformer";

import { ns } from "@framework/constants";
import { GradeStrategy, IGrade } from "@framework/types";
import { SearchableEntity } from "@gemunion/nest-js-module-typeorm-helpers";

import { ContractEntity } from "../../blockchain/hierarchy/contract/contract.entity";
import { AssetEntity } from "../asset/asset.entity";

@Entity({ schema: ns, name: "grade" })
export class GradeEntity extends SearchableEntity implements IGrade {
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

  @Column({ type: "int" })
  public contractId: number;

  @JoinColumn()
  @ManyToOne(_type => ContractEntity)
  public contract: ContractEntity;

  @Column({ type: "float" })
  public growthRate: number;
}
