import { Column, Entity } from "typeorm";

import { Erc20TokenEventType, IErc20ContractHistory, TErc20TokenEventData } from "@framework/types";
import { ns } from "@framework/constants";
import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-helpers";

@Entity({ schema: ns, name: "erc20_contract_history" })
export class Erc20ContractHistoryEntity extends IdDateBaseEntity implements IErc20ContractHistory {
  @Column({ type: "varchar" })
  public address: string;

  @Column({ type: "varchar" })
  public transactionHash: string;

  @Column({
    type: "enum",
    enum: Erc20TokenEventType,
  })
  public eventType: Erc20TokenEventType;

  @Column({ type: "json" })
  public eventData: TErc20TokenEventData;
}
