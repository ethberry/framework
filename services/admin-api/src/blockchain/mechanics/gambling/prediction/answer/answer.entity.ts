import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";

import { ns } from "@framework/constants";
import { IdDateBaseEntity } from "@ethberry/nest-js-module-typeorm-postgres";
import type { IPredictionAnswer } from "@framework/types";
import { PredictionAnswer } from "@framework/types";

import { PredictionQuestionEntity } from "../question/question.entity";
import { UserEntity } from "../../../../../infrastructure/user/user.entity";

@Entity({ schema: ns, name: "prediction_answer" })
export class PredictionAnswerEntity extends IdDateBaseEntity implements IPredictionAnswer {
  @Column({ type: "int" })
  public questionId: number;

  @JoinColumn()
  @ManyToOne(_type => PredictionQuestionEntity, merchant => merchant.answers)
  public question: PredictionQuestionEntity;

  @Column({ type: "int" })
  public userId: number;

  @JoinColumn()
  @OneToOne(_type => UserEntity)
  public user: UserEntity;

  @Column({
    type: "enum",
    enum: PredictionAnswer,
  })
  public answer: PredictionAnswer;
}
