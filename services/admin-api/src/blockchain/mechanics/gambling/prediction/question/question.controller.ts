import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor } from "@gemunion/nest-js-utils";

import { PredictionQuestionService } from "./question.service";
import { PredictionQuestionEntity } from "./question.entity";
import { PredictionQuestionSearchDto } from "./dto";

@ApiBearerAuth()
@Controller("/prediction/questions")
export class PredictionQuestionController {
  constructor(private readonly predictionQuestionService: PredictionQuestionService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: PredictionQuestionSearchDto): Promise<[Array<PredictionQuestionEntity>, number]> {
    return this.predictionQuestionService.search(dto);
  }

  @Get("/autocomplete")
  public autocomplete(): Promise<Array<PredictionQuestionEntity>> {
    return this.predictionQuestionService.autocomplete();
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<PredictionQuestionEntity | null> {
    return this.predictionQuestionService.findOne({ id });
  }
}
