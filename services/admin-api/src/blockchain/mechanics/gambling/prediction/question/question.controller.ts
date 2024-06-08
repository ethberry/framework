import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseInterceptors,
  Delete,
  HttpCode,
} from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor, User } from "@gemunion/nest-js-utils";

import { PredictionQuestionCreateDto, PredictionQuestionSearchDto, PredictionQuestionUpdateDto } from "./dto";
import { PredictionQuestionService } from "./question.service";
import { PredictionQuestionEntity } from "./question.entity";
import { UserEntity } from "../../../../../infrastructure/user/user.entity";

@ApiBearerAuth()
@Controller("/prediction/questions")
export class PredictionQuestionController {
  constructor(private readonly predictionQuestionService: PredictionQuestionService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: PredictionQuestionSearchDto): Promise<[Array<PredictionQuestionEntity>, number]> {
    return this.predictionQuestionService.search(dto);
  }

  @Post("/")
  public create(
    @Body() dto: PredictionQuestionCreateDto,
    @User() userEntity: UserEntity,
  ): Promise<PredictionQuestionEntity> {
    return this.predictionQuestionService.create(dto, userEntity);
  }

  @Get("/autocomplete")
  public autocomplete(): Promise<Array<PredictionQuestionEntity>> {
    return this.predictionQuestionService.autocomplete();
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<PredictionQuestionEntity | null> {
    return this.predictionQuestionService.findOneWithRelations({ id });
  }

  @Put("/:id")
  public update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: PredictionQuestionUpdateDto,
    @User() userEntity: UserEntity,
  ): Promise<PredictionQuestionEntity> {
    return this.predictionQuestionService.update({ id }, dto, userEntity);
  }

  @Delete("/:id")
  @HttpCode(204)
  public async delete(@Param("id", ParseIntPipe) id: number): Promise<void> {
    await this.predictionQuestionService.delete({ id });
  }
}
