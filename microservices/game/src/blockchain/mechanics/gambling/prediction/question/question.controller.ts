import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor } from "@ethberry/nest-js-utils";
import { PaginationDto } from "@ethberry/collection";

import { PredictionQuestionService } from "./question.service";
import { PredictionQuestionEntity } from "./question.entity";

@ApiBearerAuth()
@Controller("/prediction/question")
export class PredictionQuestionController {
  constructor(private readonly predictionQuestionService: PredictionQuestionService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: PaginationDto): Promise<[Array<PredictionQuestionEntity>, number]> {
    return this.predictionQuestionService.search(dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<PredictionQuestionEntity | null> {
    return this.predictionQuestionService.findOne({ id });
  }
}
