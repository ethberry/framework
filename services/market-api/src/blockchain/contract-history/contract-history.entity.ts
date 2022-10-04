import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import type { IContractHistory, TContractEventData } from "@framework/types";
import { ContractEventType } from "@framework/types";
import { ns } from "@framework/constants";
import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-postgres";

import { TokenEntity } from "../hierarchy/token/token.entity";
import { ContractEntity } from "../hierarchy/contract/contract.entity";

@Entity({ schema: ns, name: "contract_history" })
export class ContractHistoryEntity extends IdDateBaseEntity implements IContractHistory {
  @Column({ type: "varchar" })
  public address: string;

  @Column({ type: "varchar" })
  public transactionHash: string;

  @Column({
    type: "enum",
    enum: ContractEventType,
  })
  public eventType: ContractEventType;

  @Column({ type: "json" })
  public eventData: TContractEventData;

  @Column({ type: "int", nullable: true })
  public tokenId: number | null;

  @JoinColumn()
  @ManyToOne(_type => TokenEntity, token => token.history)
  public token: TokenEntity;

  @Column({ type: "int", nullable: true })
  public contractId: number | null;

  @JoinColumn()
  @ManyToOne(_type => ContractEntity, contract => contract.history)
  public contract: ContractEntity;
}
