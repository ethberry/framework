import { Column, Entity } from "typeorm";

import { ContractManagerEventType, IContractManagerHistory, TContractManagerEventData } from "@framework/types";
import { ns } from "@framework/constants";
import { IdBaseEntity } from "@gemunion/nest-js-module-typeorm-helpers";

@Entity({ schema: ns, name: "contract_manager_history" })
export class ContractManagerHistoryEntity extends IdBaseEntity implements IContractManagerHistory {
  @Column({ type: "varchar" })
  public address: string;

  @Column({ type: "varchar" })
  public transactionHash: string;

  @Column({
    type: "enum",
    enum: ContractManagerEventType,
  })
  public eventType: ContractManagerEventType;

  @Column({ type: "json" })
  public eventData: TContractManagerEventData;
}
