import { Column, Entity, JoinColumn, OneToOne, OneToMany } from "typeorm";

import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-postgres";

import { ns } from "@framework/constants";
import { IReferralEvents } from "@framework/types";
import { AssetEntity } from "../../../exchange/asset/asset.entity";
import { EventHistoryEntity } from "../../../event-history/event-history.entity";
import { MerchantEntity } from "../../../../infrastructure/merchant/merchant.entity";
import { ReferralRewardShareEntity } from "./share/referral.reward.share.entity";
import { ContractEntity } from "../../../hierarchy/contract/contract.entity";

@Entity({ schema: ns, name: "referral_reward" })
export class ReferralRewardEntity extends IdDateBaseEntity implements IReferralEvents {
  @Column({ type: "varchar" })
  public account: string;

  @Column({ type: "varchar" })
  public referrer: string;

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

  @JoinColumn()
  @OneToOne(_type => ContractEntity)
  public contract?: ContractEntity;

  @Column({ type: "int", nullable: true })
  public merchantId: number;

  @JoinColumn()
  @OneToOne(_type => MerchantEntity)
  public merchant?: MerchantEntity;

  @OneToMany(_type => ReferralRewardShareEntity, shares => shares.reward)
  public shares: Array<ReferralRewardShareEntity>;
}
