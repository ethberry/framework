import { Column, Entity } from "typeorm";

import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-postgres";
import type { ITransaction } from "@framework/types";
import { TransactionStatus } from "@framework/types";
import { ns } from "@framework/constants";

@Entity({ schema: ns, name: "transactions" })
export class TransactionEntity extends IdDateBaseEntity implements ITransaction {
  @Column({ type: "varchar" })
  public transactionHash: string;

  @Column({ type: "int" })
  public chainId: number;

  @Column({ type: "int" })
  public blockNumber: number;

  @Column({ type: "int" })
  public transactionIndex: number;

  @Column({ type: "int" })
  public logIndex: number;

  @Column({ type: "json" })
  public logData: Record<string, any>;

  @Column({
    type: "enum",
    enum: TransactionStatus,
  })
  public transactionStatus: TransactionStatus;
}
