import { Body, Controller, Post, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, User } from "@ethberry/nest-js-utils";

import { UserEntity } from "../../../../../infrastructure/user/user.entity";
import { PredictionAnswerService } from "./answer.service";
import { PredictionAnswerEntity } from "./answer.entity";
import { PredictionAnswerCreateDto } from "./dto";

@ApiBearerAuth()
@Controller("/prediction/answer")
export class PredictionAnswerController {
  constructor(private readonly predictionAnswerService: PredictionAnswerService) {}

  @Post("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public create(
    @Body() dto: PredictionAnswerCreateDto,
    @User() userEntity: UserEntity,
  ): Promise<PredictionAnswerEntity> {
    return this.predictionAnswerService.create(dto, userEntity);
  }
}
