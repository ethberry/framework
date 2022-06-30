import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

import { ns } from "@framework/constants";
import { AirdropStatus, IAirdrop } from "@framework/types";
import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-helpers";
import { AssetEntity } from "../../blockchain/asset/asset.entity";

@Entity({ schema: ns, name: "airdrop" })
export class AirdropEntity extends IdDateBaseEntity implements IAirdrop {
  @Column({ type: "varchar" })
  public account: string;

  @Column({ type: "int" })
  public itemId: number;

  @JoinColumn()
  @OneToOne(_type => AssetEntity)
  public item: AssetEntity;

  @Column({
    type: "enum",
    enum: AirdropStatus,
  })
  public airdropStatus: AirdropStatus;

  @Column({ type: "varchar" })
  public signature: string;
}
