import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor } from "@gemunion/nest-js-utils";

import { PredictionAnswerService } from "./answer.service";
import { PredictionAnswerEntity } from "./answer.entity";
import { PredictionQuestionSearchDto } from "./dto";

@ApiBearerAuth()
@Controller("/prediction/answers")
export class PredictionAnswerController {
  constructor(private readonly predictionAnswerService: PredictionAnswerService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: PredictionQuestionSearchDto): Promise<[Array<PredictionAnswerEntity>, number]> {
    return this.predictionAnswerService.search(dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<PredictionAnswerEntity | null> {
    return this.predictionAnswerService.findOne({ id }, { relations: { question: true } });
  }
}
