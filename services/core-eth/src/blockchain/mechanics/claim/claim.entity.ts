import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

import { ns } from "@framework/constants";
import { ClaimStatus, IClaim } from "@framework/types";
import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-helpers";
import { AssetEntity } from "../asset/asset.entity";

@Entity({ schema: ns, name: "claim" })
export class ClaimEntity extends IdDateBaseEntity implements IClaim {
  @Column({ type: "varchar" })
  public account: string;

  @Column({ type: "int" })
  public itemId: number;

  @JoinColumn()
  @OneToOne(_type => AssetEntity)
  public item: AssetEntity;

  @Column({
    type: "enum",
    enum: ClaimStatus,
  })
  public claimStatus: ClaimStatus;

  @Column({ type: "varchar" })
  public signature: string;

  @Column({ type: "varchar" })
  public nonce: string;

  @Column({ type: "timestamptz" })
  public endTimestamp: string;
}
