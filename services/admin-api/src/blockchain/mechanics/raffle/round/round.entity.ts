import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";

import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-postgres";
import { IRaffleRound } from "@framework/types";
import { ns } from "@framework/constants";

import { ContractEntity } from "../../../hierarchy/contract/contract.entity";
import { AssetEntity } from "../../../exchange/asset/asset.entity";

@Entity({ schema: ns, name: "raffle_round" })
export class RaffleRoundEntity extends IdDateBaseEntity implements IRaffleRound {
  @Column({ type: "numeric", nullable: true })
  public number: string | null;

  @Column({ type: "numeric" })
  public roundId: string;

  @Column({ type: "numeric" })
  public contractId: number;

  @JoinColumn()
  @ManyToOne(_type => ContractEntity)
  public contract: ContractEntity;

  @JoinColumn()
  @ManyToOne(_type => ContractEntity)
  public ticketContract: ContractEntity;

  @Column({ type: "numeric" })
  public ticketContractId: number;

  @JoinColumn()
  @OneToOne(_type => AssetEntity)
  public price: AssetEntity;

  @Column({ type: "int" })
  public priceId: number;

  @Column({ type: "numeric" })
  public maxTickets: number;

  @Column({ type: "timestamptz" })
  public startTimestamp: string;

  @Column({ type: "timestamptz" })
  public endTimestamp: string;
}
