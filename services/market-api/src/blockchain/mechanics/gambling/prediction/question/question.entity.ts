import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { Exclude } from "class-transformer";

import { ns } from "@framework/constants";
import { SearchableEntity } from "@gemunion/nest-js-module-typeorm-postgres";
import type { IPredictionQuestion } from "@framework/types";
import { PredictionQuestionResult, PredictionQuestionStatus } from "@framework/types";

import { MerchantEntity } from "../../../../../infrastructure/merchant/merchant.entity";
import { AssetEntity } from "../../../../exchange/asset/asset.entity";
import { ContractEntity } from "../../../../hierarchy/contract/contract.entity";
import { PredictionAnswerEntity } from "../answer/answer.entity";

@Entity({ schema: ns, name: "prediction_question" })
export class PredictionQuestionEntity extends SearchableEntity implements IPredictionQuestion {
  @Column({ type: "numeric" })
  public contractId: number;

  @JoinColumn()
  @ManyToOne(_type => ContractEntity)
  public contract: ContractEntity;

  @Column({ type: "int" })
  public merchantId: number;

  @JoinColumn()
  @ManyToOne(_type => MerchantEntity)
  public merchant: MerchantEntity;

  @Column({ type: "timestamptz" })
  public startTimestamp: string;

  @Column({ type: "timestamptz" })
  public endTimestamp: string;

  @Column({ type: "int" })
  public maxVotes: number;

  @Column({
    type: "enum",
    enum: PredictionQuestionStatus,
  })
  public questionStatus: PredictionQuestionStatus;

  @Column({
    type: "enum",
    enum: PredictionQuestionResult,
  })
  public questionResult: PredictionQuestionResult;

  @OneToMany(_type => PredictionAnswerEntity, assets => assets.question)
  public answers: Array<PredictionAnswerEntity>;

  @Exclude()
  @Column({ type: "int" })
  public priceId: number;

  @JoinColumn()
  @OneToOne(_type => AssetEntity)
  public price: AssetEntity;
}
