import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

import { ns } from "@framework/constants";
import { IStakingPenalty } from "@framework/types";
import { IdDateBaseEntity } from "@ethberry/nest-js-module-typeorm-postgres";
import { AssetEntity } from "../../../../exchange/asset/asset.entity";
import { ContractEntity } from "../../../../hierarchy/contract/contract.entity";

@Entity({ schema: ns, name: "staking_penalty" })
export class StakingPenaltyEntity extends IdDateBaseEntity implements IStakingPenalty {
  @Column({ type: "int" })
  public stakingId: number;

  @JoinColumn()
  @OneToOne(_type => ContractEntity)
  public staking: ContractEntity;

  @Column({ type: "int" })
  public penaltyId: number;

  @JoinColumn()
  @OneToOne(_type => AssetEntity)
  public penalty: AssetEntity;
}
