import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";

import { PredictionAnswerEntity } from "./answer.entity";
import { UserEntity } from "../../../../../infrastructure/user/user.entity";

@Injectable()
export class PredictionAnswerService {
  constructor(
    @InjectRepository(PredictionAnswerEntity)
    private readonly predictionAnswerEntityRepository: Repository<PredictionAnswerEntity>,
  ) {}

  public create(dto: DeepPartial<PredictionAnswerEntity>, userEntity: UserEntity): Promise<PredictionAnswerEntity> {
    return this.predictionAnswerEntityRepository
      .create({
        ...dto,
        user: userEntity,
      })
      .save();
  }
}
