import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { Exclude } from "class-transformer";

import { ns } from "@framework/constants";
import { IRent, RentRuleStatus } from "@framework/types";
import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-postgres";

import { ContractEntity } from "../../hierarchy/contract/contract.entity";
import { AssetEntity } from "../../exchange/asset/asset.entity";

@Entity({ schema: ns, name: "rent" })
export class RentEntity extends IdDateBaseEntity implements IRent {
  @Exclude()
  @Column({ type: "int" })
  public priceId: number;

  @JoinColumn()
  @OneToOne(_type => AssetEntity)
  public price: AssetEntity;

  @Column({ type: "varchar" })
  public title: string;

  @Column({ type: "int" })
  public contractId: number;

  @JoinColumn()
  @ManyToOne(_type => ContractEntity)
  public contract: ContractEntity;

  @Column({
    type: "enum",
    enum: RentRuleStatus,
  })
  public rentStatus: RentRuleStatus;
}
