import { Column, Entity } from "typeorm";

import { IdBaseEntity } from "@gemunion/nest-js-module-typeorm-helpers";
import { ns } from "@gemunion/framework-constants";

import { ITransaction, TransactionStatus } from "./interfaces";

@Entity({ schema: ns, name: "transaction" })
export class WatcherEntity extends IdBaseEntity implements ITransaction {
  @Column({
    type: "varchar",
    unique: true,
  })
  public transactionHash: string;

  @Column({
    type: "int",
  })
  public blockNumber: number;

  @Column({
    type: "enum",
    enum: TransactionStatus,
  })
  public status: TransactionStatus;
}
