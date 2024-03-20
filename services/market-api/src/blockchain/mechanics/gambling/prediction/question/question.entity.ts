import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";

import { ns } from "@framework/constants";
import { SearchableEntity } from "@gemunion/nest-js-module-typeorm-postgres";
import type { IPredictionQuestion } from "@framework/types";
import { PredictionQuestionAnswer, PredictionQuestionStatus } from "@framework/types";

import { MerchantEntity } from "../../../../../infrastructure/merchant/merchant.entity";
import { PredictionAnswerEntity } from "../answer/answer.entity";

@Entity({ schema: ns, name: "prediction_question" })
export class PredictionQuestionEntity extends SearchableEntity implements IPredictionQuestion {
  @Column({ type: "int" })
  public merchantId: number;

  @JoinColumn()
  @ManyToOne(_type => MerchantEntity)
  public merchant: MerchantEntity;

  @Column({
    type: "enum",
    enum: PredictionQuestionStatus,
  })
  public questionStatus: PredictionQuestionStatus;

  @OneToMany(_type => PredictionAnswerEntity, assets => assets.question)
  public answers: Array<PredictionAnswerEntity>;

  @Column({
    type: "enum",
    enum: PredictionQuestionAnswer,
  })
  public answer: PredictionQuestionAnswer;
}
