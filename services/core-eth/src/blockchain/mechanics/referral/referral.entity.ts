import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-postgres";
import { IReferralReward } from "@framework/types";
import { ns } from "@framework/constants";
import { AssetEntity } from "../../exchange/asset/asset.entity";
import { EventHistoryEntity } from "../../event-history/event-history.entity";

@Entity({ schema: ns, name: "referral_reward" })
export class ReferralEntity extends IdDateBaseEntity implements IReferralReward {
  @Column({ type: "varchar" })
  public account: string;

  @Column({ type: "varchar" })
  public referrer: string;

  @Column({ type: "int" })
  public level: number;

  @Column({ type: "int" })
  public priceId: number;

  @JoinColumn()
  @OneToOne(_type => AssetEntity)
  public price: AssetEntity;

  @Column({ type: "int", nullable: true })
  public itemId: number | null;

  @JoinColumn()
  @OneToOne(_type => AssetEntity)
  public item: AssetEntity;

  @Column({ type: "int" })
  public historyId: number;

  @JoinColumn()
  @OneToOne(_type => EventHistoryEntity)
  public history?: EventHistoryEntity;

  @Column({ type: "int", nullable: true })
  public contractId: number | null;
}
