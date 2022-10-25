import { Column, Entity } from "typeorm";

import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-postgres";
import { IWalletPayee } from "@framework/types";
import { ns } from "@framework/constants";

@Entity({ schema: ns, name: "wallet_payees" })
export class WalletPayeesEntity extends IdDateBaseEntity implements IWalletPayee {
  @Column({ type: "varchar" })
  public account: string;

  @Column({ type: "int" })
  public shares: number;
}
